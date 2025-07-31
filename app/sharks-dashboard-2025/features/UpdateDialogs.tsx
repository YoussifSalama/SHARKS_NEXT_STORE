"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import DynamicCategoryCard from "./DynamicCategoryCard";
import { useFileUploader } from "@/app/actions/files/clientFiles";
import { updateOneCategory } from "@/app/actions/category/category";
import { toast } from "react-toastify";
import Loader from "./Loader";

interface CategoryCardData {
    id?: number;
    img: File | null | string;
    title: string;
    slogan: string;
    description: string;
}

export const UpdateCategoryDialog = ({
    children,
    title,
    description,
    data,
    setRefresh
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    data: CategoryCardData;
    setRefresh?: (refresh: number) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const oldFileUrl = typeof data.img === "string" ? data.img : null;

    const { uploadFile } = useFileUploader(setProgress);

    const handleUpdate = async (formData: CategoryCardData) => {
        setLoading(true);

        try {
            let imageUrl = oldFileUrl;

            if (formData.img instanceof File) {
                const uploadedFile = await uploadFile(
                    formData.img,
                    "category",
                    true,
                    oldFileUrl || undefined
                );
                if (!uploadedFile?.url) {
                    toast.error("Failed to upload image. Please try again.");
                    setLoading(false);
                    return;
                }
                imageUrl = uploadedFile.url;
            }

            const result = await updateOneCategory(formData.id as number, {
                ...formData,
                img: imageUrl as string,
            });

            if (result?.ok) {
                toast.success(result.message);
                setRefresh && setRefresh(Math.random());
            } else {
                toast.error(result?.message || "Something went wrong.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update category.");
        }

        setLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{React.Children.toArray(children)[0]}</DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DynamicCategoryCard
                    data={data}
                    handleUpdate={handleUpdate}
                    progress={progress}
                >
                    <Button
                        type="submit"
                        variant="default"
                        className="w-full flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? <Loader classname="w-4 h-4" /> : "Update"}
                    </Button>

                </DynamicCategoryCard>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
