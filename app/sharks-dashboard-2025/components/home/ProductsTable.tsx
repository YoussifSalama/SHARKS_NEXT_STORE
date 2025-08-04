"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllProducts } from "@/app/actions/product/product";
import { cn } from "@/lib/utils";

// Skeleton Loader (Reusable)
const TableSkeleton = ({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) => (
    <>
        {Array.from({ length: rows }).map((_, idx) => (
            <TableRow key={idx} className="animate-pulse">
                {/* Cover */}
                <TableCell>
                    <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                </TableCell>

                {/* Title */}
                <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </TableCell>

                {/* Description */}
                <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </TableCell>

                {/* Status */}
                <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </TableCell>

                {/* In Stock */}
                <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </TableCell>

            </TableRow>
        ))}
    </>
);

type StatusStylesType = {
    status: "active" | "inActive" | "draft";
    style: string;
};

type Variant = {
    stock: number;
    size: string;
    color: string;
    id: number;
    price: number;
    imgs: { id: number; url: string }[];
};

const statusStyles: StatusStylesType[] = [
    { status: "active", style: "bg-green-200 text-green-600" },
    { status: "inActive", style: "bg-red-200 text-red-600" },
    { status: "draft", style: "bg-gray-200 text-gray-600" },
];

export default function ProductsTable() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getAllProducts(1, 10, "asc", "all", "", {
                product: ["id", "title", "description", "status", "createdAt"],
                variants: ["id", "color", "stock", "size", "price"],
                imgs: 1,
            });
            if (result?.data) setProducts(result.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const rows = useMemo(() => {
        if (!products.length) return null;

        return products.map((prod) => {
            const statusStyle = statusStyles.find((s) => s.status === prod.status);
            const coverImg = prod.variants?.[0]?.imgs?.[0]?.url || "/placeholder.png";
            const totalStock = prod.variants?.reduce((sum: number, v: Variant) => sum + (v.stock ?? 0), 0) ?? 0;

            return (
                <TableRow key={prod.id}>
                    <div className="w-18 h-18 overflow-hidden   flex items-center justify-center">
                        <img
                            src={coverImg || "/placeholder.png"}
                            alt={prod.title || "Category"}
                            className="w-[90%] h-[90%] object-cover shadow-md rounded-md border"
                            loading="lazy"
                        />
                    </div>
                    <TableCell>{prod.title}</TableCell>
                    <TableCell className="text-xs truncate max-w-xs">{prod.description || "-"}</TableCell>
                    <TableCell>
                        {statusStyle && (
                            <span className={cn(statusStyle.style, "px-3 py-1 rounded-md text-sm font-medium")}>
                                {statusStyle.status === "active"
                                    ? "Active"
                                    : statusStyle.status === "inActive"
                                        ? "Inactive"
                                        : "Draft"}
                            </span>
                        )}
                    </TableCell>
                    <TableCell>{totalStock}</TableCell>
                </TableRow>
            );
        });
    }, [products]);

    return (
        <Table>
            <TableCaption>Products</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In Stock</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableSkeleton rows={10} cols={5} />
                ) : products.length > 0 ? (
                    rows
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                            No products found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
