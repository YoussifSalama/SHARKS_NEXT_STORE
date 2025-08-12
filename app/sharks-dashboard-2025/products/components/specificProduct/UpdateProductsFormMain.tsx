"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import AddProductFormStatic from "./UpdateProductFormStatic";
import { Button } from "@/components/ui/button";
import { useFileUploader } from "@/app/actions/files/clientFiles";
import { toast } from "react-toastify";
import { addNewProduct, updateProduct } from "@/app/actions/product/product";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";

export default function AddProductsFormMain({ product, setRefresh }: { product: any, setRefresh: (refresh: number) => void }) {
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
        console.log({ data });

        setLoading(true);
        try {
            const finalVariants = [];

            for (let vIndex = 0; vIndex < data.variants.length; vIndex++) {
                const variant = data.variants[vIndex];
                const coverIndex = variant.coverIndex ?? 0;

                const existingUrls: string[] = [];
                const filesToUpload: File[] = [];

                variant.imgs.forEach((img: string | File) => {
                    if (img instanceof File) {
                        filesToUpload.push(img);
                    } else {
                        existingUrls.push(img);
                    }
                });

                let uploadedUrls: string[] = [];
                if (filesToUpload.length > 0) {
                    uploadedUrls = await handleVariantImageUpload(filesToUpload, vIndex, coverIndex);
                }

                let finalImgs: string[] = [];

                variant.imgs.forEach((img: string | File) => {
                    if (img instanceof File) {
                        const uploaded = uploadedUrls.shift();
                        if (uploaded) finalImgs.push(uploaded);
                    } else {
                        finalImgs.push(img);
                    }
                });

                if (coverIndex !== undefined && coverIndex < finalImgs.length) {
                    const cover = finalImgs[coverIndex];
                    finalImgs.splice(coverIndex, 1);
                    finalImgs.unshift(cover);
                }

                finalVariants.push({
                    ...variant,
                    imgs: finalImgs
                });
            }

            const uploadedMainImgs = await Promise.all(
                (data.imgs || []).map(async (file: string | File) => {
                    if (file instanceof File) {
                        const res = await uploadFile(file, "product");
                        return res?.url;
                    }
                    return file;
                })
            );

            let result;
            if (product?.id) {
                result = await updateProduct(product.id, {
                    ...data,
                    imgs: uploadedMainImgs,
                    variants: finalVariants
                });
            }

            if (!result?.ok) {
                toast.error(result?.message || "Failed to save product.");
            } else {
                form.reset();
                toast.success(result?.message || "Product saved successfully");
                setVariantProgress({});
                setRefresh(Math.random());
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
            <AddProductFormStatic variantProgress={variantProgress} defaultValues={{
                catDefValue: {
                    title: product?.subCategory?.category.title,
                    id: +product?.subCategory?.category.id,
                    img: product?.subCategory?.category.img

                },
                subCatDefValue: {
                    title: product?.subCategory?.title,
                    id: +product?.subCategory?.id,
                    img: product?.subCategory?.img

                }
            }} />
            <Button className="fixed bottom-6 px-8 right-6" type="submit"
            >
                {loading ? <Loader classname="w-4 h-4" /> : "Update"}
            </Button>
        </form>
    );
}