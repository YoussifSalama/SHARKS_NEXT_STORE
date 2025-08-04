"use client";

import AddProductsFormMain from "../components/add/AddProductsFormMain";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const sizesRecord = {
    XS: "XS", S: "S", M: "M", L: "L", XL: "XL",
    "2XL": "2XL", "3XL": "3XL", "4XL": "4XL", "5XL": "5XL"
} as const;

const sizeEnum = z.enum(Object.values(sizesRecord), "Size is required");

const productValidationSchema = z.object({
    title: z.string().min(3, "Title min length is 3."),
    description: z.string().min(10, "Description min length is 10."),
    status: z.enum(["active", "inActive", "draft"]),
    categoryId: z.coerce.number().min(1, "Category is required"),
    subCategoryId: z.coerce.number().min(1, "Sub category is required"),
    variants: z.array(
        z.object({
            color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Invalid hex color" }),
            stock: z.coerce.number().min(1, "Stock min is 1."),
            size: z.array(sizeEnum).min(1, "Select at least one size"),
            price: z.coerce.number().min(1, "Price min is 1."),
            imgs: z.array(z.instanceof(File)).min(1, "Please upload images for variant."),
        })
    ).min(1, "At least one variant is required").superRefine((variants, ctx) => {
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


export default function AddProduct() {
    const form = useForm({
        resolver: zodResolver(productValidationSchema),
        defaultValues: {
            title: "",
            description: "",
            variants: [],
        },
    });


    return (
        <FormProvider {...form}>
            <AddProductsFormMain />
        </FormProvider>
    );
}
