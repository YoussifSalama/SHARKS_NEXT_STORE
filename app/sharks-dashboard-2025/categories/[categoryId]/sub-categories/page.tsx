"use client";

import { useEffect, useState } from "react";
import SubCategoryCard from "@/app/sharks-dashboard-2025/features/SubCategoryCard";
import { CategoriesLoader } from "@/app/sharks-dashboard-2025/features/Loader";
import Paginations from "@/app/sharks-dashboard-2025/features/Paginations";
import { getAllSubCategories } from "@/app/actions/category/subcategory";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SubCategories = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);
    const { categoryId } = useParams();
    const router = useRouter();
    const [subCategories, setSubCategories] = useState<{
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

    const fetchSubCategories = async () => {
        setLoading(true);
        try {
            let catNo;
            if (!categoryId) {
                toast.error("Category id is missing.")
                router.push("/sharks-dashboard-2025/categories")
                return;
            }
            else {
                catNo = Number(categoryId);
            }
            const result = await getAllSubCategories(settings.page, settings.limit, settings.order, catNo, search);

            if (result) setSubCategories(result);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubCategories();
    }, [settings, refresh, applySearch]);

    const hasData = Array.isArray(subCategories?.data) && subCategories.data.length > 0;
    const isEmpty = subCategories && (!subCategories.data || subCategories.data.length === 0);

    return (
        <div className="p-4 min-h-dvh flex flex-col">
            {subCategories?.meta && (
                <Paginations
                    meta={subCategories.meta}
                    settings={settings}
                    setSettings={setSettings as any}
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
                        {subCategories!.data.map((subCat) => (
                            <SubCategoryCard
                                key={subCat.id || subCat.title}
                                data={subCat}
                                settings={true}
                                setRefresh={setRefresh}
                            />
                        ))}
                    </div>
                )}

                {!loading && isEmpty && (
                    <div className="h-dvh flex items-center justify-center w-full">
                        <p className="text-gray-500">No sub categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubCategories;
