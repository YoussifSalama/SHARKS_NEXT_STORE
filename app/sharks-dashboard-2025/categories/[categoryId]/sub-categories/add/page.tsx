"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { useFileDestroyer, useFileUploader } from "@/app/actions/files/clientFiles";
import { toast } from "react-toastify";
import Progressbar from "@/app/sharks-dashboard-2025/features/Progressbar";
import SubCategoryCard from "@/app/sharks-dashboard-2025/features/SubCategoryCard";
import FileInput from "@/app/sharks-dashboard-2025/features/FileInput";
import { CategoryContext } from "@/context/admin/StoreCategoryContext";
import { addNewSubCategory } from "@/app/actions/category/subcategory";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";

const addNewCategoryValidationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").max(50, "Title max length 50 characters"),
    slogan: z.string().min(3, "Slogan must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    img: z.any().refine((file) => file instanceof File, {
        message: "Please upload a valid image file",
    }),
});

const AddSubCategory = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [progressType, setProgressType] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const { uploadFile } = useFileUploader(setProgress);
    const { destroyFile } = useFileDestroyer(setProgress);
    const categoryStore = useContext(CategoryContext);
    const { categoryId } = useParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof addNewCategoryValidationSchema>>({
        resolver: zodResolver(addNewCategoryValidationSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            slogan: "",
            description: "",
            img: null,
        },
    });



    const handleAddNewSubCategory = async (
        data: z.infer<typeof addNewCategoryValidationSchema>
    ) => {
        setLoading(true);
        setProgressType(true);
        uploadFile(data.img, "subcategory")
            .then(async (uploadedFile) => {
                const url = uploadedFile?.url;

                if (!url) {
                    toast.error("Failed to upload image. Please try again.");
                    setLoading(false);
                    return;
                }
                let catNo;
                if (!categoryId) {
                    toast.error("Category id is issing.")
                    router.push("/sharks-dashboard-2025/categories")
                    return;
                }
                else {
                    catNo = Number(categoryId)
                }
                const result = await addNewSubCategory({ ...data, img: url }, catNo);

                if (result?.ok) {
                    toast.dark(result.message);
                } else {
                    setProgressType(false);
                    destroyFile(url, "subcategory")
                    toast.error(result?.message || "Something went wrong.");
                }

                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message || "Failed to add new category.");
                setLoading(false);
            });
    };


    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {/* Form */}
            <div
                className={`${display
                    ? "col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-4 2xl:col-span-5"
                    : "col-span-1 md:col-span-2 lg:col-span-5 xl:col-span-6 2xl:col-span-7"
                    } max-md:order-last`}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddNewSubCategory)} className="space-y-4 w-full flex flex-col">
                        {/* Image Field */}
                        <FormField
                            name="img"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <FileInput
                                            id="img"
                                            onChange={(file) => field.onChange(file)}
                                        />
                                    </FormControl>
                                    <div>  {progress > 0 && progress <= 100 && <Progressbar progress={progress} upload={progressType} />}
                                    </div>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Title Field */}
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Sub Category title..." />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Slogan Field */}
                        <FormField
                            name="slogan"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slogan</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Sub Category slogan..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Sub Category description..." {...field} className="min-h-[300px]" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Buttons */}
                        <div className="w-full space-x-4 mt-auto flex">
                            <Button type="submit"
                                disabled={loading || progress > 0}
                            >{
                                    loading ? <Loader classname="w-4 h-4" /> : "Add"
                                }</Button>
                            <Button type="button" onClick={() => setDisplay(!display)} variant="ghost">
                                {display ? "Hide Preview" : "Display Preview"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Preview */}
            {display && (
                <div className="col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-2 space-y-2 transition-all duration-300 max-sm:order-first">
                    <Label>Sub Category Preview</Label>
                    <SubCategoryCard
                        data={{
                            id: 0,
                            ...form.watch(),
                            img: form.watch("img") ?? null,
                        }}
                    />
                    {
                        categoryStore?.data &&
                        <div className="border shadow-md p-4 rounded-md flex ">
                            <div className="space-y-2 w-50 flex items-center justify-center flex-col">
                                <img src={categoryStore?.data?.img} alt={`category-` + categoryStore?.data?.title + `-img`}
                                    className="w-24 rounded-md shadow-md object-contain h-fit"
                                />
                                <p className="capitalize font-bold text-center w-fit">{categoryStore?.data?.title}</p>
                            </div>
                            <div className="p-2">
                                <p className="capitalize font-medium text-sm text-center w-fit">{categoryStore?.data?.title}</p>

                                <p className="text-sm text-gray-600 break-words whitespace-pre-wrap max-w-full"
                                    style={{
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {categoryStore?.data?.description.slice(0, 200)}...
                                </p>
                            </div>
                        </div>
                    }
                </div>
            )}

        </div>
    );
};

export default AddSubCategory;
