"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from "react-hook-form";
import AddProductsFormVariants from './UpdateProductsFormVariants';
import AddProductFormCategory from './UpdateProductFormCategory';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

type CatsType = {
    title: string,
    id: number,
    img: string
}

interface DefaultValuesInterface {
    catDefValue: CatsType;
    subCatDefValue: CatsType;
}

const AddProductFormStatic = ({ variantProgress, defaultValues }: { variantProgress: any, defaultValues: DefaultValuesInterface }) => {
    const form = useFormContext();

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Product title..." />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500 font-medium" />
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="min-h-[300px]" placeholder="Product description..." />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500 font-medium" />
                        </FormItem>
                    )}
                />
                <FormField
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inActive">In active</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage className="text-xs text-red-500 font-medium" />
                        </FormItem>
                    )}
                />
            </div>
            <div>
                <AddProductFormCategory defaultValues={defaultValues} />
            </div>
            <div>
                <AddProductsFormVariants variantProgress={variantProgress} />
            </div>
        </div>
    );
};

export default AddProductFormStatic;
