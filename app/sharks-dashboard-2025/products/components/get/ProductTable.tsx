"use client";

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

const ProductTable = ({
    loading,
    products,
    setRefresh
}: {
    loading: boolean;
    products: any[];
    setRefresh: (refresh: number) => void
}) => {
    const router = useRouter();

    const statusStyles: StatusStylesType[] = [
        {
            status: "active",
            style: "bg-green-200 border p-2 rounded-md shadow-md text-green-500",
        },
        {
            status: "inActive",
            style: "bg-red-200 border p-2 rounded-md shadow-md text-red-500",
        },
        {
            status: "draft",
            style: "bg-gray-200 border p-2 rounded-md shadow-md text-gray-500",
        },
    ];

    return (
        <Table>
            <TableCaption>Products</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>In stock</TableHead>
                    <TableHead>Settings</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <ProductsLoader />
                ) : products.length > 0 ? (
                    products.map((prod) => {
                        const statusStyle = statusStyles.find(
                            (s) => s.status === prod.status
                        );

                        const coverImg =
                            prod.variants?.[0]?.imgs?.[0]?.url || "/placeholder.png";


                        const totalStock = prod.variants
                            ? prod.variants.reduce(
                                (total: number, v: Variant) => total + (v.stock ?? 0),
                                0
                            )
                            : 0;

                        return (
                            <TableRow key={prod.id}>
                                <TableCell>
                                    <img
                                        src={coverImg}
                                        className="w-24 h-24 rounded-md shadow-md object-cover"
                                        loading="lazy"
                                        alt={`product img ${prod.title}`}
                                    />
                                </TableCell>
                                <TableCell>{prod.title}</TableCell>
                                <TableCell className="text-xs">
                                    {prod.description?.slice(0, 30) || "-"}
                                </TableCell>
                                <TableCell>
                                    {statusStyle && (
                                        <span className={cn(statusStyle.style, "px-4")}>
                                            {statusStyle.status == "active" ? "Active" : (statusStyle.status == "inActive") ? "In active" : (statusStyle.status == "draft") && "Draft"}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>{totalStock}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button
                                        onClick={() => {
                                            router.push("products/" + prod.id);
                                        }}
                                        variant="outline"
                                        className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105"
                                    >
                                        <Eye />
                                    </Button>
                                    <DeleteProductDialog productId={prod.id} setRefresh={setRefresh} />
                                </TableCell>
                            </TableRow>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500">
                            No products found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

const ProductsLoader = () => {
    return (
        <>
            {Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                    <TableCell className="w-[100px]">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-36"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default ProductTable;
