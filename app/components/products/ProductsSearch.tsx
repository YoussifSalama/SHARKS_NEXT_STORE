"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getProducts } from "@/app/actions/product/product";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { CommonImagesPreview } from "@/app/features/common/CommonImagesPreview";
import CommonProductMeta from "@/app/features/common/CommonProductMeta";

const ProductsSearchSection = () => {
    return (
        <section className="container py-8 flex flex-col items-center gap-4 min-h-[calc(100vh-200px)]">
            <SearchBar />
        </section>
    );
};

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [queryTerm, setQueryTerm] = useState("");
    const [sortBy, setSortBy] = useState<"createdAt-desc" | "createdAt-asc" | "price-asc" | "price-desc">("createdAt-desc");
    const [isBest, setIsBest] = useState(false);
    const [variants, setVariants] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const limit = 20;
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async (reset = false) => {
        startTransition(async () => {
            try {
                const res = await getProducts({
                    search: queryTerm || "",
                    page,
                    limit,
                    sortField: sortBy.startsWith("price") ? "price" : "createdAt",
                    sortOrder: sortBy.endsWith("asc") ? "asc" : "desc",
                    isBest,
                });

                const newData = res.data || [];
                setVariants((prev) => reset ? newData : [...prev, ...newData]);
                setHasMore(newData.length === limit);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                if (reset) setVariants([]);
            }
        });
    };

    useEffect(() => {
        setPage(1);
        fetchProducts(true);
    }, [queryTerm, sortBy, isBest]);

    useEffect(() => {
        if (page > 1) fetchProducts();
    }, [page]);

    return (
        <div className="flex flex-col gap-4 items-center w-full overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-3 py-4">
                <SearchInputBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSearch={() => {
                        setPage(1);
                        setQueryTerm(searchTerm.trim());
                    }}
                    onClear={() => {
                        setPage(1);
                        setQueryTerm("");
                    }}
                />
                <SortSelector value={sortBy} onChange={setSortBy} />
                <BestSwitch value={isBest} onChange={setIsBest} />
            </div>

            {isPending && variants.length === 0 ? (
                <div className="flex justify-center items-center mt-10 h-dvh">
                    <Loader2 className="animate-spin w-8 h-8 text-main-3" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8 mt-6 w-full">
                        {variants.map((variant) => (
                            <Link
                                key={variant.id}
                                href={`/shop/products/${variant.product.id}`}
                                className="scale-85 space-y-7"
                            >
                                {/* @ts-ignore */}
                                <CommonImagesPreview images={variant.imgs?.map(img => img.url) || []} />
                                <CommonProductMeta
                                    title={variant.product.title}
                                    color={variant.color}
                                    sizes={variant.sizes}
                                    price={variant.price}
                                    badge={variant.offer > 0 ? `-${variant.offer}%` : undefined}
                                />
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            {isPending ? (
                                <Loader2 className="animate-spin w-6 h-6 text-main-3" />
                            ) : (
                                <Button
                                    className="text-main-2 bg-main-1 hover:bg-main-1/70 rounded-none px-8 py-6"
                                    onClick={() => setPage((prev) => prev + 1)}
                                >
                                    Load More
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

interface SortSelectorProps {
    value: string;
    onChange: (val: any) => void;
}
const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="createdAt-asc">Oldest</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
        </Select>
    );
};

interface BestSwitchProps {
    value: boolean;
    onChange: (val: boolean) => void;
}
const BestSwitch: React.FC<BestSwitchProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <Switch checked={value} onCheckedChange={onChange} />
            <span className="text-sm">{value ? "Best" : "Normal"}</span>
        </div>
    );
};

interface SearchInputBarProps {
    value: string;
    onChange: (val: string) => void;
    onSearch: () => void;
    onClear: () => void;
}
const SearchInputBar: React.FC<SearchInputBarProps> = ({ value, onChange, onSearch, onClear }) => {
    return (
        <div className="flex items-center gap-2">
            <Input
                placeholder="Search products..."
                className="w-64"
                value={value}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(val);
                    if (val === "") onClear();
                }}
            />
            <Button className="rounded-md bg-main-3 hover:bg-main-3/80" onClick={onSearch}>
                Search
            </Button>
        </div>
    );
};

export default ProductsSearchSection;
