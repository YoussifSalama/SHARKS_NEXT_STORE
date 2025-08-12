import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Progressbar2 } from "@/app/sharks-dashboard-2025/features/Progressbar";

const AddProductsFormVariants = ({
  variantProgress,
}: {
  variantProgress: {
    [vIdx: number]: {
      [imgIdx: number]: { progress: number; uploading: boolean };
    };
  };
}) => {
  const { control, formState: { errors }, setValue, getValues, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  const [coverIndex, setCoverIndex] = useState<{ [variantIndex: number]: number }>({});

  const handleAdd = () => {
    append({ color: "#1f1f1f", size: [], stock: 1, price: 1, imgs: [] });
  };

  const variants = useWatch({ control, name: "variants" });
  useEffect(() => {
    if (variants && variants.length > 0) {
      trigger("variants");
    }
  }, [variants, trigger]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files) return;
    const currentImgs = getValues(`variants.${index}.imgs`) || [];
    if (currentImgs.length + files.length > 5) {
      alert("You can upload a maximum of 5 images per variant.");
      return;
    }
    const newFiles = Array.from(files);
    const updatedImgs = [...currentImgs, ...newFiles];
    setValue(`variants.${index}.imgs`, updatedImgs, { shouldValidate: true });

    if (coverIndex[index] === undefined && updatedImgs.length > 0) {
      setCoverIndex(prev => ({ ...prev, [index]: 0 }));
    }
  };


  const handleRemoveImage = (variantIndex: number, imgIndex: number) => {
    const currentImgs = getValues(`variants.${variantIndex}.imgs`) || [];
    const newImgs = currentImgs.filter((_: any, i: number) => i !== imgIndex);
    setValue(`variants.${variantIndex}.imgs`, newImgs, { shouldValidate: true });
    if (coverIndex[variantIndex] === imgIndex) {
      setCoverIndex((prev) => {
        const copy = { ...prev };
        delete copy[variantIndex];
        return copy;
      });
    }
  };

  const handleSetCover = (variantIndex: number, imgIndex: number) => {
    setCoverIndex((prev) => ({ ...prev, [variantIndex]: imgIndex }));
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-between">
        <Label>
          <span>Variants (color, sizes, stock, price, images)</span>
          {errors?.variants && (
            <span className="text-xs text-red-500 font-medium">{errors.variants.message as string}</span>
          )}
        </Label>
        <Button type="button" onClick={handleAdd} className="mb-4" variant="outline">
          <PlusCircle className="w-4 h-4 mr-1" /> Add Variant
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {fields.map((field, index) => {
          const variantImgs = getValues(`variants.${index}.imgs`) || [];
          const coverImgIndex = coverIndex[index];

          return (
            <div key={field.id} className="border p-3 rounded-md mb-6 relative">
              <div className="flex flex-col gap-3 mb-4">
                <FormField
                  control={control}
                  name={`variants.${index}.color`}
                  render={({ field }) => (
                    <FormItem className="w-[80%]">
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} className="h-10 p-0" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>price</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`variants.${index}.offer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  type="button"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <FormField
                control={control}
                name={`variants.${index}.sizes`}
                render={({ field }) => {
                  const sizeValues: { size: string; stock: number }[] = field.value || [];

                  const handleSizeStockChange = (sizeLabel: string, newStock: number) => {
                    const filtered = sizeValues.filter((s) => s.size !== sizeLabel);
                    if (newStock > 0) {
                      field.onChange([...filtered, { size: sizeLabel, stock: newStock }]);
                    } else {
                      field.onChange(filtered);
                    }
                  };

                  const getStockValue = (sizeLabel: string) => {
                    return sizeValues.find((s) => s.size === sizeLabel)?.stock || "";
                  };

                  return (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Sizes and Stock</FormLabel>
                      </div>
                      <div className="grid gap-3 grid-cols-2">
                        {sizes.map((sizeLabel) => (
                          <div key={sizeLabel} className="flex items-center gap-4">
                            <Label className="w-10">{sizeLabel}</Label>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Stock"
                              value={getStockValue(sizeLabel)}
                              onChange={(e) => handleSizeStockChange(sizeLabel, parseInt(e.target.value || "0"))}
                              className="w-24"
                            />
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />


              <FormItem className="mt-4">
                <FormLabel>Images (max 5)</FormLabel>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImagesChange(e, index)}
                  disabled={variantImgs.length >= 5}
                />
                <FormMessage />
              </FormItem>

              <div className="flex gap-3 mt-2 flex-wrap">
                {variantImgs.map((file: File, imgIndex: number) => {
                  const url = URL.createObjectURL(file);
                  const isCover = coverImgIndex === imgIndex;
                  const progressData = variantProgress?.[index]?.[imgIndex] || { progress: 0, uploading: false };
                  return (
                    <div
                      key={imgIndex}
                      className={`relative w-28 h-28 rounded overflow-hidden border cursor-pointer ${isCover ? "border-4 border-gray-300 z-20" : "border-gray-300 z-10"
                        }`}
                      onClick={() => handleSetCover(index, imgIndex)}
                    >
                      <img src={url} alt="variant image" className="object-cover w-full h-full" />
                      {progressData.uploading && (
                        <div className="absolute inset-0 z-30">
                          <Progressbar2 progress={progressData.progress} upload={true} />
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index, imgIndex);
                        }}
                        variant="outline"
                        className="absolute top-1 right-1 flex items-center justify-center text-xs rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105 z-40"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AddProductsFormVariants;
