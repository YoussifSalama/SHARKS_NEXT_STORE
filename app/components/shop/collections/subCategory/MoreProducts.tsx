"use client";

import { getRandomProducts } from "@/app/actions/product/product";
import { CommonImagesPreview } from "@/app/features/common/CommonImagesPreview";
import CommonProductMeta from "@/app/features/common/CommonProductMeta";

import Link from "next/link";
import { usePathname } from "next/navigation";


type ProductImage = { id: number; variantId: number; url: string };

type SizeType = {
    size: string;
    stock: number;
};

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

const ProductCard = ({ item }: { item: FlattenedVariant }) => {
    const pathName = usePathname();
    const images = item.imgs.map((img) => img.url);

    return (
        <div className="py-6 transition hover:scale-[1.02]">
            <Link
                href={`/shop/products/${item.id}`}
                className="space-y-4 *:w-full block relative"
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
};

const MoreProducts = ({ data }: { data: FlattenedVariant[] }) => {
    if (!data || data.length === 0) return null;

    return (
        <section className="flex flex-col gap-4 py-8 container mt-[20]">
            <p className="text-main-1 font-bold text-2xl">More Products...</p>
            <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                {data.map((item) => (
                    <ProductCard key={`${item.id}-${item.color}`} item={item} />
                ))}
            </div>
            <div className="flex items-center justify-end">
                <Link
                    href={"/shop/products"}
                    className="text-main-2 bg-main-1 hover:bg-main-1/70 rounded-none px-8 py-3"
                >
                    Browse More...
                </Link>
            </div>
        </section>
    );
};


export default MoreProducts;
