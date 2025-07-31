interface CategoryCardData {
    id: number;
    img: File | null | string;
    title: string;
    slogan: string;
    description: string;
}

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteDialog } from "./DeleteDialog";
import { useFileDestroyer } from "@/app/actions/files/clientFiles";
import { toast } from "react-toastify";
import { deleteOneCategory } from "@/app/actions/category/category";
import Progressbar from "./Progressbar";
import Loader from "./Loader";
import { UpdateCategoryDialog } from "./UpdateDialogs";


const CategoryCard = ({ data, setRefresh, settings }: { data: CategoryCardData, setRefresh?: (refresh: number) => void, settings?: boolean }) => {
    const [progress, setProgress] = useState<number>(0);
    const { destroyFile } = useFileDestroyer(setProgress);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [showAllDescription, setShowAllDescription] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (data.img instanceof File) {
            const url = URL.createObjectURL(data.img);
            setImageUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else if (typeof data.img === "string" && data.img.trim() !== "") {
            setImageUrl(data.img);
        } else {
            setImageUrl("/category.jpeg");
        }
    }, [data.img]);

    useEffect(() => {
        if (data.description && data.description.length > 250) {
            setDescription(data.description.slice(0, 250));
        } else {
            setDescription(data.description);
        }
    }, [data.description]);

    // setting logic
    const deleteCategory = async (id: number, url: string) => {
        setLoading(true);
        destroyFile(url, "category").then(async (deletedFile) => {
            if (deletedFile.ok) {
                const result = await deleteOneCategory(id);
                if (result.ok) {
                    toast.dark(result.message);
                    setRefresh && setRefresh(Math.random())
                } else {
                    toast.error(result.message || "Something went wrong.");
                }
            } else {
                toast.error("Failed to delete img, category will be deleted without img...");
            }
            setLoading(false);
        }).catch((err) => {
            toast.error(err.message || "Failed to delete img, category will be deleted without img...");
        })
    }



    return (
        <div className="rounded-md shadow-md p-4 w-full border overflow-hidden h-fit capitalize">
            <div className="relative rounded-md shadow-md overflow-hidden">
                {settings && (
                    <div className="absolute top-2 right-2 flex gap-2 z-20 ">
                        <DeleteDialog title="Delete Category" description={`Are you sure you want to delete ${data.title}?
                         This action cannot be undone.`}>
                            <Button variant="outline" className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <CategoryCard data={data} settings={false} />
                            <Button value="defautl"
                                disabled={loading || progress > 0}
                                onClick={() => deleteCategory(data.id, data.img as string)}
                            >{
                                    loading ? <Loader classname="w-4 h-4" /> : "Delete"
                                }</Button>
                            <div>  {progress > 0 && progress <= 100 && <Progressbar progress={progress} upload={false} />}
                            </div>
                        </DeleteDialog>
                        <UpdateCategoryDialog setRefresh={setRefresh} title="Update Category" description={`Are you sure you want to update ${data.title}`} data={data}>
                            <Button variant="outline" className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105">
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </UpdateCategoryDialog>
                    </div>
                )}
                {imageUrl && (
                    <img
                        alt={`image of ${data.title} category`}
                        src={imageUrl}
                        loading="lazy"
                        className="w-full h-64 object-cover z-0 relative"
                    />
                )}
                <span className="absolute inset-0 flex items-end justify-center text-white bg-opacity-30 p-2 z-10 text-shadow">
                    {data.slogan || "No slogan provided"}
                </span>
            </div>

            <p className="mt-2 font-semibold break-words">{data.title || "No title provided"}</p>

            <p
                className="text-sm text-gray-600 break-words whitespace-pre-wrap max-w-full"
                style={{ wordBreak: "break-word" }}
            >
                {description ? (
                    showAllDescription ? (
                        <>
                            {data.description}{" "}
                            <span
                                title="click to collapse"
                                className="font-bold cursor-pointer"
                                onClick={() => setShowAllDescription(false)}
                            >
                                ...
                            </span>
                        </>
                    ) : (
                        <>
                            {description}{" "}
                            <span
                                title="click to expand"
                                className="font-bold cursor-pointer"
                                onClick={() => setShowAllDescription(true)}
                            >
                                ...
                            </span>
                        </>
                    )
                ) : (
                    data.description || "lorem ipsum dolor sit amet..."
                )}
            </p>

        </div>
    );
};



export default CategoryCard;
