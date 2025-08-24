"use client";

import BackArrow from "@/app/features/BackArrow";
import { useParams, useRouter } from "next/navigation";
import AddProductsFormMain from "../components/specificProduct/UpdateProductsFormMain";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import { getOneProduct } from "@/app/actions/product/product";

const sizesRecord = {
    XS: "XS", S: "S", M: "M", L: "L", XL: "XL",
    "2XL": "2XL", "3XL": "3XL", "4XL": "4XL", "5XL": "5XL"
} as const;

const sizeEnum = z.enum(Object.values(sizesRecord));

const productValidationSchema = z.object({
    title: z.string().min(3, "Title min length is 3."),
    description: z.string().min(10, "Description min length is 10."),
    status: z.enum(["active", "inActive", "draft"]),
    categoryId: z.coerce.number().min(1, "Category is required"),
    subCategoryId: z.coerce.number().min(1, "Sub category is required"),
    variants: z.array(
        z.object({
            color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Invalid hex color" }),
            offer: z.coerce.number().optional(),
            sizes: z.array(z.object({
                size: sizeEnum,
                stock: z.number().min(1, "At least one item size required")
            })), price: z.coerce.number().min(1, "Price min is 1."),
            imgs: z.array(z.union([z.string().url(), z.instanceof(File)])).min(1, "Please upload images for variant."),
        })
    )
        .min(1, "At least one variant is required")
        .superRefine((variants, ctx) => {
            const colors = variants.map(v => v.color.toLowerCase());
            const duplicates = colors.filter((color, index) => colors.indexOf(color) !== index);

            if (duplicates.length > 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Duplicate color found! Make sure each variant has a unique color."
                });
            }
        })

});

const SpecificProduct = () => {
    const { productId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [product, setProduct] = useState<any>(null);
    const [refresh, setRefresh] = useState<number>(Math.random());

    const form = useForm({
        resolver: zodResolver(productValidationSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "active",
            categoryId: 0,
            subCategoryId: 0,
            variants: [],
        },
        mode: "onChange"
    });

    const fetchOneProduct = useCallback(async (id: number) => {
        setLoading(true);
        const result = await getOneProduct(id);

        if (result.ok && result.data) {
            setProduct(result.data);

            const status =
                result.data.status === "active" ||
                    result.data.status === "inActive" ||
                    result.data.status === "draft"
                    ? result.data.status
                    : "active";

            form.reset({
                title: result.data.title || "",
                description: result.data.description || "",
                status,
                categoryId: Number(result.data.subCategory?.categoryId) || 0,
                subCategoryId: Number(result.data.subCategoryId) || 0,
                variants:
                    result.data.variants?.map((v: any) => ({
                        color: v.color,
                        offer: v.offer ?? 0,

                        sizes: v.sizes?.map((s: any) => ({
                            size: s.size,
                            stock: Number(s.stock),
                        })) || [],
                        price: Number(v.price),
                        imgs: v.imgs?.map((imgObj: any) => imgObj.url) || []
                    })) || [],
            });
            setLoading(false)
        }
    }, [form]);

    useEffect(() => {
        if (productId) fetchOneProduct(+productId);
    }, [productId, fetchOneProduct, refresh]);

    return (
        <div className="space-y-4">
            <BackArrow title={`/Products/${productId}`} href="/sharks-dashboard-2025/products" />
            {
                (product && !loading) ?
                    <FormProvider {...form}>
                        <AddProductsFormMain product={product} setRefresh={setRefresh} />
                    </FormProvider> :
                    <ProductSkeletonLoader />
            }
        </div>
    );
};

const ProductSkeletonLoader = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Title */}
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-32 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Status */}
            <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Category & Subcategory */}
            <div className="space-y-2 flex justify-between">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4 w-[30%]">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Variants */}
            <div className="space-y-2 flex justify-between">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="flex justify-end w-[15%]">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end">
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
        </div>
    );
};




export default SpecificProduct;
