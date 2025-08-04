import { getAllCategories } from "@/app/actions/category/category";
import { getAllSubCategories } from "@/app/actions/category/subcategory";
import { ComboBox } from "@/app/features/ComboBox";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
type CatsType = {
    title: string,
    id: number,
    img: string
}

interface DefaultValuesInterface {
    catDefValue: CatsType;
    subCatDefValue: CatsType;
}

const AddProductFormCategory = ({ defaultValues }: { defaultValues: DefaultValuesInterface }) => {
    const { watch, formState: { errors } } = useFormContext();
    let selectedCategoryId = watch("categoryId");

    const getCategories = async (search: string) => {
        const result = await getAllCategories(1, 10, "asc", search, ["title", "id", "img"]);
        const items = result.data.map((item) => {
            return {
                id: Number(item.id),
                title: item.title.toString(),
                img: item.img ? item.img.toString() : ""
            }
        })
        return items;
    };

    const getSubCategories = async (search: string) => {
        if (!selectedCategoryId) return [];
        else {
            let catNo = Number(selectedCategoryId);
            const result = await getAllSubCategories(1, 10, "asc", catNo as number, search, ["title", "id", "img"]);
            const items = result.data.map((item) => {
                return {
                    id: Number(item.id),
                    title: item.title.toString(),
                    img: item.img ? item.img.toString() : ""
                }
            })
            return items;
        }
    };


    return (<div className="flex flex-wrap gap-4 justify-between">
        <Label>
            <span>Category & sub category.</span>
            {errors?.categoryId && (
                <span className="text-destructive text-xs text-red-500 font-medium">
                    {"Category is required."}
                </span>
            )}
            {errors?.subCategoryId && (
                <span className="text-destructive text-xs text-red-500 font-medium">
                    {"Sub category is required."}
                </span>
            )}
        </Label>
        <div className="flex gap-4 flex-wrap">
            <div>
                <ComboBox name="categoryId" getItems={getCategories} defaultValue={defaultValues.catDefValue} />
            </div>
            {
                selectedCategoryId &&
                <div>
                    <ComboBox name="subCategoryId" getItems={getSubCategories} defaultValue={defaultValues.subCatDefValue} />
                </div>
            }
        </div>
    </div>);
}
export default AddProductFormCategory;