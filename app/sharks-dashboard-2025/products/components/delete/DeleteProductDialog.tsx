"use client";

import { deleteProduct } from "@/app/actions/product/product";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export function DeleteProductDialog({ productId, setRefresh }: { productId: number, setRefresh: (refresh: number) => void }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDeleteProduct = async (id: number) => {
        setLoading(true);
        try {
            const result = await deleteProduct(id);
            if (result.ok) {
                toast.success(result.message);
                setOpen(false);
                setRefresh(Math.random());
            } else {
                toast.error(result.message);
            }
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="rounded-sm shadow-md bg-white opacity-85 hover:opacity-100 hover:scale-105"
                >
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete product</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={loading}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDeleteProduct(productId)}
                        disabled={loading}
                    >
                        {loading ? <Loader classname="w-4 h-4" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
