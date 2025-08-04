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
import { getAllSubCategories } from "@/app/actions/category/subcategory";

// Skeleton Loader for table rows
const SubCategoriesTableLoader = () => {
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
                </TableRow>
            ))}
        </>
    );
};

const SubCategoriesTable = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await getAllSubCategories(1, 10, "asc");
            if (result && result.data) {
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
            <TableCaption>Latest 10 sub categories</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Slogan</TableHead>
                    <TableHead >Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <SubCategoriesTableLoader />
                ) : categories.length > 0 ? (
                    categories.map((cat) => (
                        <TableRow key={cat.id}>
                            <TableCell className="font-medium">{cat.id}</TableCell>
                            <TableCell>{cat.title}</TableCell>
                            <TableCell>{cat.slogan || "-"}</TableCell>
                            <TableCell >
                                {cat.description?.slice(0, 30) || "-"}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                            No sub categories found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default SubCategoriesTable;
