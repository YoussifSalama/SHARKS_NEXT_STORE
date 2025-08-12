"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import AddProductFormStatic from "./AddProductFormStatic";
import { Button } from "@/components/ui/button";
import { useFileUploader } from "@/app/actions/files/clientFiles";
import { toast } from "react-toastify";
import { addNewProduct } from "@/app/actions/product/product";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";

export default function AddProductsFormMain() {
    const [loading, setLoading] = useState(false);
    const [variantProgress, setVariantProgress] = useState<{ [key: number]: { [key: number]: { progress: number; uploading: boolean } } }>({});
    const { uploadFile } = useFileUploader(() => { });
    const form = useFormContext();

    const handleVariantImageUpload = async (
        files: File[],
        variantIndex: number,
        coverIndex?: number
    ) => {
        const urls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const progressCallback = (progress: number) => {
                setVariantProgress((prev) => ({
                    ...prev,
                    [variantIndex]: {
                        ...prev[variantIndex],
                        [i]: { progress, uploading: true },
                    },
                }));
            };

            const res = await uploadFile(files[i], "product", false, undefined, progressCallback);
            if (res?.url) urls.push(res.url);

            setVariantProgress((prev) => ({
                ...prev,
                [variantIndex]: {
                    ...prev[variantIndex],
                    [i]: { progress: 100, uploading: false },
                },
            }));
        }

        if (coverIndex !== undefined && urls[coverIndex]) {
            const cover = urls[coverIndex];
            urls.splice(coverIndex, 1);
            urls.unshift(cover);
        }

        return urls;
    };

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            const finalVariants = [];
            for (let vIndex = 0; vIndex < data.variants.length; vIndex++) {
                const variant = data.variants[vIndex];
                const coverIndex = variant.coverIndex ?? 0;
                const uploadedUrls = await handleVariantImageUpload(variant.imgs, vIndex, coverIndex);
                finalVariants.push({ ...variant, imgs: uploadedUrls });
            }
            const uploadedMainImgs = await Promise.all(
                (data.imgs || []).map(async (file: File) => {
                    const res = await uploadFile(file, "product");
                    return res?.url;
                })
            );
            const result = await addNewProduct({ ...data, imgs: uploadedMainImgs, variants: finalVariants });
            if (!result?.ok) toast.error(result?.message || "Failed to add new product.");
            else {
                form.reset();
                toast.success(result?.message || "Product added successfully");
                setVariantProgress({});
            }
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
            style={loading ? { opacity: 0.6, pointerEvents: "none" } : {}}
        >
            <AddProductFormStatic variantProgress={variantProgress} />
            <Button className="w-full" type="submit">
                {loading ? <Loader classname="w-4 h-4" /> : "Add"}
            </Button>
        </form>
    );
}