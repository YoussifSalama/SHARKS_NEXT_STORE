"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from "react"

export function DeleteDialog({ children, title, description }: { children: React.ReactNode, title: string, description: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {React.Children.toArray(children)[0]}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="mb-2">
                        {React.Children.toArray(children)[3]}
                    </div>
                    {React.Children.toArray(children)[1]}
                </div>
                <DialogFooter className="sm:justify-start">
                    {React.Children.toArray(children)[2]}
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
