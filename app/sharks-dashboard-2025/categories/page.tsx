"use client";

import { getAllCategories } from "@/app/actions/category/category";
import { useEffect, useState } from "react";
import CategoryCard from "../features/CategoryCard";
import { CategoriesLoader } from "../features/Loader";
import Pagination from "../features/Paginations";

const Categories = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);
    const [categories, setCategories] = useState<{
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

    const [search, setSearch] = useState<string>("");
    const [applySearch, setApplySearch] = useState<number>(Math.random());
    const [settings, setSettings] = useState<{
        page: number;
        limit: number;
        order: "asc" | "desc";
    }>({
        page: 1,
        limit: 10,
        order: "asc",
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await getAllCategories(settings.page, settings.limit, settings.order, search);
            if (result) setCategories(result);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [settings, refresh, applySearch]);

    const hasData = Array.isArray(categories?.data) && categories.data.length > 0;
    const isEmpty = categories && (!categories.data || categories.data.length === 0);

    return (
        <div className="p-4 min-h-dvh flex flex-col">
            {categories?.meta && (
                <Pagination
                    meta={categories.meta}
                    settings={settings}
                    setSettings={setSettings}
                    setSearch={setSearch}
                    setApplySearch={setApplySearch}
                />
            )}

            <div className="flex-grow mt-4">
                {loading && (
                    <div className="h-dvh">
                        <CategoriesLoader />
                    </div>
                )}

                {!loading && hasData && (
                    <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4">
                        {categories!.data.map((cat) => (
                            <CategoryCard
                                key={cat.id || cat.title}
                                data={cat}
                                settings={true}
                                setRefresh={setRefresh}
                            />
                        ))}
                    </div>
                )}

                {!loading && isEmpty && search.trim() !== "" && (
                    <div className="h-dvh flex items-center justify-center w-full">
                        <p className="text-gray-500">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );

};


export default Categories;
