"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFileDestroyer, useFileUploader } from "@/app/actions/files/clientFiles";
import { toast } from "react-toastify";
import Progressbar from "@/app/sharks-dashboard-2025/features/Progressbar";
import SubCategoryCard from "@/app/sharks-dashboard-2025/features/SubCategoryCard";
import FileInput from "@/app/sharks-dashboard-2025/features/FileInput";
import { addNewSubCategory } from "@/app/actions/category/subcategory";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";
import { ComboBox } from "@/app/features/ComboBox";
import { getAllCategories } from "@/app/actions/category/category";

const addNewSubCategorySchema = z.object({
    categoryId: z.number().min(1, "Please select a category"),
    title: z.string().min(3, "Title must be at least 3 characters long").max(50, "Title max length 50 characters"),
    slogan: z.string().min(3, "Slogan must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    img: z.any().refine((file) => file instanceof File, {
        message: "Please upload a valid image file",
    }),
});

export default function AddSubCategory() {
    const [display, setDisplay] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressType, setProgressType] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const { uploadFile } = useFileUploader(setProgress);
    const { destroyFile } = useFileDestroyer(setProgress);

    const form = useForm<z.infer<typeof addNewSubCategorySchema>>({
        resolver: zodResolver(addNewSubCategorySchema),
        mode: "onChange",
        defaultValues: {
            categoryId: 0,
            title: "",
            slogan: "",
            description: "",
            img: null,
        },
    });

    const categoryId = form.watch("categoryId");

    const getCategories = async (search: string) => {
        const result = await getAllCategories(1, 10, "asc", search, ["title", "id", "img", "description"]);
        return result.data.map((item) => ({
            id: Number(item.id),
            title: String(item.title),
            img: item.img ? String(item.img) : "",
            description: item.description || ""
        }));
    };

    useEffect(() => {
        if (!categoryId) {
            setSelectedCategory(null);
            return;
        }
        (async () => {
            const result = await getAllCategories(1, 1, "asc", "", ["title", "id", "img", "description"]);
            const found = result.data.find((cat) => Number(cat.id) === Number(categoryId));
            if (found) {
                setSelectedCategory({
                    id: Number(found.id),
                    title: found.title,
                    img: found.img,
                    description: found.description || ""
                });
            }
        })();
    }, [categoryId]);

    const handleAddNewSubCategory = async (data: z.infer<typeof addNewSubCategorySchema>) => {
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

                const result = await addNewSubCategory({ ...data, img: url }, data.categoryId);
                if (result?.ok) {
                    toast.dark(result.message);
                    form.reset();
                } else {
                    setProgressType(false);
                    destroyFile(url, "subcategory");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {/* Form */}
            <div className={`${display ? "col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-4 2xl:col-span-5" : "col-span-1 md:col-span-2 lg:col-span-5 xl:col-span-6 2xl:col-span-7"} max-md:order-last`}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddNewSubCategory)} className="space-y-4 flex flex-col">

                        {/* Category Selector */}
                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="*:w-full">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <ComboBox
                                            name="categoryId"
                                            getItems={getCategories}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Image Field */}
                        <FormField
                            name="img"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <FileInput id="img" onChange={(file) => field.onChange(file)} />
                                    </FormControl>
                                    {progress > 0 && progress <= 100 && <Progressbar progress={progress} upload={progressType} />}
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
                                        <Input {...field} placeholder="Sub Category slogan..." />
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
                                        <Textarea {...field} placeholder="Sub Category description..." className="min-h-[300px]" />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        {/* Buttons */}
                        <div className="flex gap-4 mt-auto">
                            <Button type="submit" disabled={loading || progress > 0}>
                                {loading ? <Loader classname="w-4 h-4" /> : "Add"}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setDisplay(!display)}>
                                {display ? "Hide Preview" : "Display Preview"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Preview */}
            {display && (
                <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-4 transition-all duration-300 max-sm:order-first">
                    <Label>Sub Category Preview</Label>
                    <SubCategoryCard
                        data={{
                            id: 0,
                            ...form.watch(),
                            img: form.watch("img") ?? null,
                        }}
                    />
                    {selectedCategory && (
                        <div className="border shadow-md p-4 rounded-md flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                            <div className="flex flex-col items-center w-full sm:w-auto">
                                <div className="w-24 h-24 rounded-md overflow-hidden shadow-md">
                                    <img src={selectedCategory.img} alt={`category-${selectedCategory.title}-img`} className="w-full h-full object-cover" />
                                </div>
                                <p className="capitalize font-bold mt-2 text-base sm:text-lg">{selectedCategory.title}</p>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <p className="capitalize font-medium text-sm sm:text-base mb-1">{selectedCategory.title}</p>
                                <p className="text-sm sm:text-base text-gray-600 break-words whitespace-pre-wrap"
                                    style={{
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {selectedCategory.description.slice(0, 200)}...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
