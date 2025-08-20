"use client";

import { getAllProductsForSubCatDynamicPage } from "@/app/actions/product/product";
import Empty from "@/app/components/common/Empty";
import { CommonImagesPreview } from "@/app/features/common/CommonImagesPreview";
import CommonProductMeta from "@/app/features/common/CommonProductMeta";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type settingsType = {
    page: number;
    limit: number;
};

type SizeType = {
    size: string;
    stock: number;
};

type ProductImage = { id: number; variantId: number; url: string };

type FlattenedVariant = {
    id: string;
    title: string;
    description: string;
    color: string;
    imgs: ProductImage[];
    offer: number;
    sizes: SizeType[];
    price: number;
};

const Products = ({ subCatId }: { subCatId: number }) => {
    const [data, setData] = useState<FlattenedVariant[]>([]);
    const [settings, setSettings] = useState<settingsType>({ page: 1, limit: 20 });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const pathName = usePathname();

    const getSubCatProducts = async (page: number, limit: number, id: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await getAllProductsForSubCatDynamicPage(page, limit, id);

            const formattedData: FlattenedVariant[] =
                result?.data
                    ?.map((product: any) =>
                        product.variants.map((variant: any) => ({
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            color: variant.color,
                            imgs: variant.imgs,
                            offer: variant.offer,
                            sizes: variant.sizes,
                            price: variant.price,
                        }))
                    )
                    .flat() || [];

            setData((prev) =>
                page === 1 ? formattedData : [...(prev || []), ...formattedData]
            );
        } catch (err) {
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setSettings((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    useEffect(() => {
        getSubCatProducts(settings.page, settings.limit, subCatId);
    }, [settings.page, subCatId]);

    if (loading && data.length === 0) {
        return (
            <section className="h-dvh flex items-center justify-center">
                <Loader classname="w-8 h-8" />
            </section>
        );
    }

    if (error) {
        return (
            <section className="h-dvh flex flex-col items-center justify-center space-y-4">
                <p className="text-red-500">{error}</p>
                <Button
                    onClick={() =>
                        getSubCatProducts(settings.page, settings.limit, subCatId)
                    }
                >
                    Retry
                </Button>
            </section>
        );
    }

    if (!loading && data.length === 0) {
        return (
            <section className="flex items-center justify-center h-dvh">
                <Empty messgae="No Products Found" className="w-[300px] h-[300px] text-main-3" />
            </section>
        );
    }

    return (
        <section className="container py-8">
            <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {data.map((item) => {
                    const images = item.imgs.map((img) => img.url);
                    return (
                        <div key={`${item.id}-${item.color}`} className="py-6 hover:scale-[1.02] transition">
                            <Link
                                href={`${pathName}/product/${item.id}`}
                                className="space-y-4 *:w-full"
                            >
                                <CommonImagesPreview images={images} />
                                <CommonProductMeta
                                    title={item.title}
                                    color={item.color}
                                    sizes={item.sizes}
                                    price={item.price}
                                    badge={item.offer > 0 ? `-${item.offer}%` : undefined}
                                />
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-10">
                {loading ? (
                    <Loader classname="w-6 h-6" />
                ) : (
                    <Button
                        className="text-main-2 bg-main-1 hover:bg-main-1/70 rounded-none px-8 py-6"
                        onClick={handleLoadMore}
                    >
                        Load More
                    </Button>
                )}
            </div>
        </section>
    );
};

export default Products;
