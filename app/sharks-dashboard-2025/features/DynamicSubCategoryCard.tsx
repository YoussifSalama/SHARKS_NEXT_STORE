"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { Progressbar2 } from "./Progressbar";

interface SubCategoryCardData {
    id?: number;
    img: File | null | string;
    title: string;
    slogan: string;
    description: string;
}

const updateSubCategoryValidationSchema = (hasOldImg: boolean) =>
    z.object({
        title: z.string().min(3, "Title must be at least 3 characters long").max(50, "Title max length 50 characters"),
        slogan: z.string().min(3, "Slogan must be at least 3 characters long"),
        description: z.string().min(10, "Description must be at least 10 characters long"),
        img: hasOldImg
            ? z.any().refine(
                (file) => file instanceof File || typeof file === "string" || file === null || file === undefined,
                { message: "Please upload a valid image file" }
            )
            : z.any().refine(
                (file) => file instanceof File || typeof file === "string",
                { message: "Please upload a valid image file" }
            ),
    });


interface DynamicCategoryCardProps {
    data: SubCategoryCardData;
    children: React.ReactNode;
    handleUpdate: (formData: SubCategoryCardData) => void | Promise<void>;
    loading?: boolean;
    progress?: number;
}

const DynamicSubCategoryCard = ({
    data,
    children,
    handleUpdate,
    loading = false,
    progress = 0,
}: DynamicCategoryCardProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        typeof data.img === "string" ? data.img : null
    );

    const hasOldImg = typeof data.img === 'string' && !!data.img;
    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues, setValue, trigger } = useForm({
        resolver: zodResolver(updateSubCategoryValidationSchema(hasOldImg)),
        mode: "onChange",
        defaultValues: {
            title: data.title,
            slogan: data.slogan,
            description: data.description,
            img: data.img,
        },
    });

    useEffect(() => {
        if (typeof data.img === "string") {
            setPreviewUrl(data.img);
        }
    }, [data]);

    const handleSubCategoryUpdate = async (formData: any) => {
        let imgValue: File | string | null = data.img;
        if (formData.img instanceof File) {
            imgValue = formData.img;
        } else if (
            formData.img === null ||
            formData.img === undefined ||
            (typeof formData.img === 'object' && !(formData.img instanceof File)) ||
            (typeof formData.img === 'string' && formData.img.trim() === '')
        ) {
            imgValue = typeof data.img === 'string' ? data.img : null;
        } else if (typeof formData.img === 'string') {
            imgValue = formData.img;
        }
        const updatedData: SubCategoryCardData = {
            id: data.id,
            img: imgValue,
            title: formData.title,
            slogan: formData.slogan,
            description: formData.description,
        };
        try {
            await Promise.resolve(handleUpdate(updatedData));
        } catch (err) {
            toast.error("Failed to update sub category. Please try again.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleSubCategoryUpdate)}
            className="rounded-md shadow-md p-4 w-full border overflow-hidden h-fit capitalize space-y-2"
        >
            <div className="relative rounded-md shadow-md overflow-hidden">
                {previewUrl && (
                    <img
                        alt={`image of ${data.title} sub-category`}
                        src={previewUrl}
                        loading="lazy"
                        className="w-full h-64 object-cover z-0 relative"
                    />
                )}

                {progress > 0 && progress <= 100 && (
                    <Progressbar2 progress={progress} upload={true} />
                )}
            </div>


            <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    await setValue("img", file ?? null, { shouldValidate: true });
                    await trigger("img");
                    if (file) {
                        setPreviewUrl(URL.createObjectURL(file));
                    }
                }}
                disabled={loading || isSubmitting}
            />
            {errors.img && <p className="text-red-500 text-xs">{errors.img.message as string}</p>}

            <Input type="text" {...register("title")}
                disabled={loading || isSubmitting}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}

            <Input type="text" {...register("slogan")}
                disabled={loading || isSubmitting}
            />
            {errors.slogan && <p className="text-red-500 text-xs">{errors.slogan.message as string}</p>}

            <Textarea
                className="text-sm text-gray-600 whitespace-pre-wrap max-w-full"
                style={{ wordBreak: "break-word" }}
                {...register("description")}
                disabled={loading || isSubmitting}
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message as string}</p>}

            <div className="flex justify-end">
                {/* Clone children and pass loading/isSubmitting to button if possible */}
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && (child.type as any)?.displayName !== "Loader") {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            disabled: loading || isSubmitting,
                        });
                    }
                    return child;
                })}
            </div>
        </form>
    );
};

export default DynamicSubCategoryCard;
