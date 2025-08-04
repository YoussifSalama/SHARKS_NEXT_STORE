"use client";

import { useEffect, useState } from "react";
import { getAllCategories } from "@/app/actions/category/category";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const CategoriesTableLoader = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                    <TableCell>
                        <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

const CategoriesTable = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await getAllCategories(1, 10, "asc");
            if (result?.data) {
                setCategories(result.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Table>
            <TableHeader>
            <div className="p-2">Categories</div>
                <TableRow>
                    <TableHead>Cover</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slogan</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <CategoriesTableLoader />
                ) : categories.length > 0 ? (
                    categories.map((cat) => (
                        <TableRow key={cat.id}>
                            <div className="w-18 h-18 overflow-hidden   flex items-center justify-center">
                                <img
                                    src={cat.img || "/placeholder.png"}
                                    alt={cat.title || "Category"}
                                    className="w-[90%] h-[90%] object-cover shadow-md rounded-md border"
                                    loading="lazy"
                                />
                            </div>

                            <TableCell>{cat.title}</TableCell>
                            <TableCell>{cat.slogan || "-"}</TableCell>
                            <TableCell className="max-w-xs truncate">
                                {cat.description || "-"}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                            No categories found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default CategoriesTable;
