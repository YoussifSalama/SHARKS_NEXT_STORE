"use client";

import { CommonButton2 } from "@/app/features/common/CommonButtons";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";


const sendMailValidationSchema = z.object({
    email: z.email("Please enter a valid email."),
    name: z.string().min(3, "Name must be at least 3 charecters").optional(),
    message: z.string().min(10, "Message must be at least 10 charecters.")
});


const formItems: { name: "email" | "name" | "message", label: string, placeholder: string, id: number }[] = [
    {
        id: 1,
        name: "email",
        label: "Enter your Email.",
        placeholder: "Your email here..."
    },
    {
        id: 2,
        name: "name",
        label: "Enter your Name. (optional)",
        placeholder: "Your Name here..."
    },
    {
        id: 3,
        name: "message",
        label: "Enter your Message.",
        placeholder: "Your message here..."
    },
]

const ContactForm = () => {
    const form = useForm({
        resolver: zodResolver(sendMailValidationSchema),
        defaultValues: {
            email: "",
            name: "",
            message: ""
        }
    });

    return (
        <FormProvider {...form}>
            <form className="space-y-4">
                <h2 className="text-2xs w-full text-center font-bold">Or FIll This form...</h2>
                {formItems.map((item) => (
                    <FormField
                        key={item.id}
                        name={item.name}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor={String(item.id)}>{item.label}</FormLabel>
                                {item.name === "message" ? (
                                    <Textarea {...field} placeholder={item.placeholder} className="rounded-none" />
                                ) : (
                                    <Input {...field} id={String(item.id)} type="text" placeholder={item.placeholder} className="rounded-none" />
                                )}
                            </FormItem>
                        )}
                    />
                ))}
                <CommonButton2 title="Send" />
                <p className="text-xs">This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.</p>
            </form>
        </FormProvider>
    );
};

export default ContactForm;