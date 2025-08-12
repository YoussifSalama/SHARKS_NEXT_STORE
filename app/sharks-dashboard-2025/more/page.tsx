"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getImageDimensions } from "@/hooks/ImageMetaHook";
import FileInput from "../features/FileInput";
import { CommonButton1 } from "@/app/features/common/CommonButtons";
import { useFileDestroyer, useFileUploader } from "@/app/actions/files/clientFiles";
import { getHero, HandleHeroSubmit } from "@/app/actions/more/hero";
import Progressbar from "../features/Progressbar";
import Loader from "../features/Loader";

const heroValidationSchema = z.object({
    do: z.string().min(3, "Do must be at least 3 characters"),
    img: z
        .any()
        .refine((file) => (file instanceof File || typeof file == "string"), {
            message: "Please upload a valid image file",
        })
        .refine(
            async (file) => {
                if (typeof file == "string") return true;
                const imageDimensions = await getImageDimensions(file);
                if (!imageDimensions) return false;

                const { width, height } = imageDimensions;
                const isRectangle = width !== height;

                return isRectangle;
            },
            {
                message: "Image must be rectangular.",
            }
        ).optional()
});

type HeroFormType = z.infer<typeof heroValidationSchema>;

const Hero = () => {
    const [loading, setLoading] = useState(false);
    const [oldImgUrl, setOldImgUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [progressType, setProgressType] = useState<boolean>(true);
    const { uploadFile } = useFileUploader(setProgress);
    const { destroyFile } = useFileDestroyer(setProgress);
    const form = useForm<HeroFormType>({
        resolver: zodResolver(heroValidationSchema),
        mode: "onChange",
        defaultValues: {
            do: "",
            img: null,
        },
    });

    const handleSubmit = async (data: HeroFormType) => {
        try {
            setLoading(true);

            let fileUrl: string | null = null;

            if (data.img instanceof File) {
                if (oldImgUrl) {
                    setProgressType(false);
                    await destroyFile(oldImgUrl, "more");
                }
                setProgressType(true);
                const uploadedFile = await uploadFile(data.img, "more");
                fileUrl = uploadedFile?.url || null;
            }
            else if (typeof data.img === "string") {
                fileUrl = data.img;
            }

            if (fileUrl) {
                const result = await HandleHeroSubmit(fileUrl, data.do);
                if (!result.ok) {
                    setProgressType(false);
                    if (data.img instanceof File) {
                        setProgressType(false);
                        await destroyFile(fileUrl, "more");
                    }
                    toast.error(result.message);
                } else if (result.message) {
                    toast.dark(result.message);
                }
            } else {
                toast.error("Failed to submit hero.");
            }

        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };


    type HeroData = { do: string; img: string };

    const fetchHero = async () => {
        const result = await getHero();
        if (result?.ok && result?.data) {
            const data = result.data as HeroData;
            setOldImgUrl(data.img)
            form.reset({
                do: data.do,
                img: data.img
            })
        }
    }
    useEffect(() => {
        fetchHero();
    }, [])

    return (
        <Form {...form}>
            {/* Preview Section */}
            <HeroSectionDemo data={{
                do: form.watch("do"),
                img: form.watch("img"),
            }} />
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 w-full flex flex-col"
            >
                {/* Do Field */}
                <FormField
                    name="do"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hero Do Sentence</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter hero do..." {...field} />
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
                            <FormLabel>Hero Background Image</FormLabel>
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

                {/* Submit */}
                <Button type="submit" disabled={loading}>
                    {loading ? <Loader classname="w-4 h-4" /> : "Submit Hero"}
                </Button>
            </form>


        </Form>
    );
};

const HeroSectionDemo = ({ data }: { data: { do: string; img: File | null } }) => {
    const [bgUrl, setBgUrl] = useState<string | null>(null);
    const [title, setTitle] = useState<string>(data.do);

    useEffect(() => {
        if (data.img instanceof File) {
            const url = URL.createObjectURL(data.img);
            setBgUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }
        else if (typeof data.img == "string") {
            setBgUrl(data.img);
        }
        else {
            setBgUrl(null);
        }
    }, [data.img]);

    useEffect(() => {
        setTitle(data.do);
    }, [data.do])

    if (!bgUrl) return null;

    return (
        <section
            className="w-full bg-cover bg-center rounded-lg mt-4 flex items-center justify-center my-6 h-dvh"
            style={{
                backgroundImage: `url(${bgUrl})`,
                backgroundPositionY: "0",
                backgroundPositionX: "center"
            }}
        >
            <div className="w-full h-full flex items-end justify-start p-4">
                <CommonButton1 title={title} />
            </div>
        </section>
    );
};

export default Hero;
