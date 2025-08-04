"use client";

import { getAllProducts } from "@/app/actions/product/product";
import { useCallback, useEffect, useState } from "react";
import Paginations from "../features/Paginations";
import ProductTable from "./components/get/ProductTable";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Products = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    } | null>(null);

    const [search, setSearch] = useState("");
    const [applySearch, setApplySearch] = useState(Math.random());
    const [refresh, setRefresh] = useState<number>(Math.random());
    const [settings, setSettings] = useState<{
        page: number;
        limit: number;
        order: "asc" | "desc";
        status: "active" | "inActive" | "draft" | "all";
    }>({
        page: 1,
        limit: 10,
        order: "asc",
        status: "all",
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { page, limit, order, status: productStatus } = settings;

        const result = await getAllProducts(
            page,
            limit,
            order,
            productStatus,
            search,
            {
                product: ["id", "title", "description", "status", "createdAt"],
                variants: ["id", "color", "stock", "size", "price"],
                imgs: 1
            }
        );

        if (result) {
            setProducts(result);
        }
        setLoading(false);
    }, [settings, search]);

    useEffect(() => {
        fetchProducts();
    }, [settings, applySearch, search, refresh]);

    return (
        <section>
            {products?.meta?.page && (
                <Paginations
                    meta={products.meta}
                    settings={settings}
                    setSettings={setSettings}
                    setSearch={setSearch}
                    setApplySearch={setApplySearch}
                />
            )}

            {!loading && products?.data ? (
                <ProductTable loading={loading} products={products.data} setRefresh={setRefresh} />
            ) : (
                <ProductsLoader />
            )}
        </section>
    );
};

const ProductsLoader = () => {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cover</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>In Stock</TableHead>
                        <TableHead>Settings</TableHead>
                    </TableRow>
                </TableHeader>
                {Array.from({ length: 10 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse h-full">
                        <TableCell className="w-[100px]">
                            <div className="w-24 h-24 bg-gray-200 rounded"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                        <TableCell className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-36"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 bg-gray-200 rounded w-36"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 bg-gray-200 rounded w-36"></div>
                        </TableCell>
                        <TableCell className="flex gap-2 h-[100px]">
                            <div className="flex gap-2 h-full items-center">
                                <div className="px-4 h-fit py-3 bg-gray-200 rounded"></div>
                                <div className="px-4 h-fit py-3 bg-gray-200 rounded"></div>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
        </>
    );
};

export default Products;
