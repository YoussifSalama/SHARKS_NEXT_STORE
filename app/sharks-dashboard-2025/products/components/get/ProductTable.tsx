"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteProductDialog } from "../delete/DeleteProductDialog";

const TableSkeleton = ({ rows = 10, cols = 6 }: { rows?: number; cols?: number }) => (
    <>
        {Array.from({ length: rows }).map((_, idx) => (
            <TableRow key={idx} className="animate-pulse">
                {Array.from({ length: cols }).map((_, colIdx) => (
                    <TableCell key={colIdx}>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
);

type StatusType = "active" | "inActive" | "draft";
type StatusStylesType = { status: StatusType; label: string; style: string };

const statusStyles: StatusStylesType[] = [
    { status: "active", label: "Active", style: "bg-green-200 text-green-600" },
    { status: "inActive", label: "Inactive", style: "bg-red-200 text-red-600" },
    { status: "draft", label: "Draft", style: "bg-gray-200 text-gray-600" },
];

type Variant = {
    stock: number;
    sizes: string;
    color: string;
    id: number;
    price: number;
    imgs: { id: number; url: string }[];
};

type Size = {
    size: string,
    stock: number
}
export default function ProductTable({
    loading,
    products,
    setRefresh,
}: {
    loading: boolean;
    products: any[];
    setRefresh: (refresh: number) => void;
}) {
    const router = useRouter();

    const rows = useMemo(() => {
        return products.map((prod) => {
            const status = statusStyles.find((s) => s.status === prod.status);
            const coverImg = prod.variants?.[0]?.imgs?.[0]?.url || "/placeholder.png";

            return (
                <TableRow key={prod.id}>
                    <div className="w-18 h-18 overflow-hidden flex items-center justify-center">
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
                        {status && (
                            <span className={cn(status.style, "px-3 py-1 rounded-md text-sm font-medium")}>
                                {status.label}
                            </span>
                        )}
                    </TableCell>
                    <TableCell className="space-x-2">
                        <Button
                            onClick={() => router.push(`products/${prod.id}`)}
                            variant="outline"
                            className="rounded-sm shadow bg-white opacity-85 hover:opacity-100 hover:scale-105"
                        >
                            <Eye />
                        </Button>
                        <DeleteProductDialog productId={prod.id} setRefresh={setRefresh} />
                    </TableCell>
                </TableRow>
            );
        });
    }, [products, setRefresh, router]);

    return (
        <Table>
            <TableCaption>Products</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Settings</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableSkeleton rows={10} cols={6} />
                ) : products.length > 0 ? (
                    rows
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-500">
                            No products found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
