"use client";

import { updateProductVariantSizes } from "@/app/actions/product/product";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";
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
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Size = { size: string; stock: number };
type Variant = {
    stock: number;
    sizes: Size[];
    color: string;
    id: number;
    price: number;
    imgs: { id: number; url: string }[];
};

export function UpdateProductStock({
    variants,
    productId,
    oldStock,
    setRefresh,
}: {
    variants: Variant[];
    productId: number;
    oldStock: number;
    setRefresh: (refresh: number) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [choosedVariant, setChoosedVariant] = useState<Variant | null>(null);
    const [editedSizes, setEditedSizes] = useState<Size[]>([]);

    const handleChooseVariant = (variant: Variant) => setChoosedVariant(variant);

    const handleSizeChange = (index: number, value: number) => {
        setEditedSizes(prev => prev.map((s, i) => i === index ? { ...s, stock: value } : s));
    };

    const handleUpdateProductStock = async (id?: number) => {
        if (!choosedVariant || !id) {
            toast.error("Please choose a variant first");
            return;
        }

        setLoading(true);
        try {
            const variantNewStock = editedSizes.reduce((acc, s) => acc + Number(s.stock), 0);

            const otherVariants = variants.filter(v => v.id !== id);
            const otherVariantsStock = otherVariants.reduce((acc, v) => {
                const sizes: Size[] = Array.isArray(v.sizes) ? v.sizes : [];
                return acc + sizes.reduce((a, s) => a + Number(s.stock), 0);
            }, 0);

            const newProductStock = variantNewStock + otherVariantsStock;

            const soldIncrement = oldStock - newProductStock;

            const newSoldJson = { count: Math.max(0, soldIncrement + (oldStock - soldIncrement)) };

            const productData = {
                productId,
                variantId: id,
                editedSizes,
                newProductStock,
                newSoldJson,
            };

            console.log("Prepared data for update:", productData);

            await updateProductVariantSizes(id, editedSizes, productId);

            toast.success("Stock prepared successfully");
            setRefresh(Date.now());
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (choosedVariant && Array.isArray(choosedVariant.sizes)) {
            setEditedSizes([...choosedVariant.sizes]);
        } else {
            setEditedSizes([]);
        }
    }, [choosedVariant]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105"
                >
                    <PackageCheck />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update product stock</DialogTitle>
                    <DialogDescription>
                        Choose a variant and update its stock
                    </DialogDescription>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {variants?.map((item) => (
                            <div
                                key={item.id}
                                className={clsx(
                                    "w-10 h-10 rounded-full border-2 cursor-pointer",
                                    choosedVariant?.id === item.id ? "ring-2 ring-main-3" : ""
                                )}
                                style={{ backgroundColor: item.color }}
                                onClick={() => handleChooseVariant(item)}
                            />
                        ))}
                    </div>
                </DialogHeader>

                {choosedVariant && editedSizes.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        {editedSizes.map((size, index) => (
                            <div key={size.size} className="flex items-center justify-between gap-2">
                                <span className="font-medium">{size.size}</span>
                                <Input
                                    type="number"
                                    value={size.stock}
                                    onChange={(e) => handleSizeChange(index, Number(e.target.value))}
                                    min={0}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="default"
                        onClick={() => handleUpdateProductStock(choosedVariant?.id)}
                        disabled={loading}
                    >
                        {loading ? <Loader classname="w-4 h-4" /> : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
