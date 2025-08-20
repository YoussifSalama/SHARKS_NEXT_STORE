"use client";

import CommonServices, { ServiceCard } from "@/app/features/common/CommonServices";
import CommonWhatsapp from "@/app/features/common/CommonWhatsapp";
import Loader from "@/app/sharks-dashboard-2025/features/Loader";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import clsx from "clsx";
import { Earth, Gauge, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";

interface Size {
    size: string;
    stock: number;
}

interface Variant {
    id: number;
    color: string;
    price: number;
    offer: number;
    imgs: { id: number; url: string; createdAt: string; updatedAt: string }[];
    sizes: Size[];
    createdAt: string;
    updatedAt: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    status: string;
    views: number;
    clicks: number;
    subCategoryId: number;
    subCategory: any;
    variants: Variant[];
    createdAt: string;
    updatedAt: string;
}

interface ProductDisplayProps {
    product: Product;
}

const services = [
    { icon: <Gauge className="w-10 h-10 text-main-1" aria-hidden="true" />, title: "Fast Delivery" },
    { icon: <Earth className="w-10 h-10 text-main-1" aria-hidden="true" />, title: "Our Brand Purpose" },
    { icon: <HeartHandshake className="w-10 h-10 text-main-1" aria-hidden="true" />, title: "Quality Commitment" },
];

const ProductDisplay = ({ product }: ProductDisplayProps) => {
    const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [activeImage, setActiveImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    useEffect(() => {
        if (product.variants.length > 0) {
            setActiveVariant(product.variants[0]);
        }
    }, [product]);

    useEffect(() => {
        if (activeVariant) {
            const variantImages = activeVariant.imgs.map(img => img.url);
            setImages(variantImages);
            setActiveImage(variantImages[0] || "");
            setSelectedSize(activeVariant.sizes[0]?.size || null);
            setLoading(false);
        }
    }, [activeVariant]);

    if (loading) return (
        <div className="h-dvh flex items-center justify-center">
            <Loader classname="w-12 h-12" />
        </div>
    );

    if (!activeVariant) return (
        <div className="h-dvh flex items-center justify-center">
            <p className="text-main-3 text-lg">No variant available</p>
        </div>
    );

    return (
        <div>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-18 container py-8">
                <div className="space-y-6">
                    <div className="flex gap-4 mb-4">
                        {product.variants.map(variant => (
                            <button
                                key={variant.id}
                                className={clsx("w-8 h-8 rounded-full border", activeVariant.id === variant.id && "ring-2 ring-main-3")}
                                style={{ backgroundColor: variant.color }}
                                onClick={() => setActiveVariant(variant)}
                            />
                        ))}
                    </div>

                    <img
                        src={activeImage}
                        alt="product-image"
                        className="w-full h-[60vh] object-contain bg-main-3/50"
                    />

                    <Carousel className="w-full max-h-[10vh]">
                        <CarouselContent className="w-full h-fit">
                            {images.map((img, index) => (
                                <CarouselItem key={index} className="basis-1/5 cursor-pointer" onClick={() => setActiveImage(img)}>
                                    <img src={img} alt={`product-img-${index}`} className="w-full h-full object-cover" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute max-md:left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md md:p-3" />
                        <CarouselNext className="absolute max-md:right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md md:p-3" />
                    </Carousel>
                </div>

                <div className="col-span-2 flex flex-col justify-start gap-4 max-md:col-span-1">
                    <h1 className="text-2xl font-semibold">{product.title}</h1>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="mt-4 space-y-2">
                        <p className={clsx("text-xl font-bold text-main-3", activeVariant.offer > 0 && "line-through opacity-45")}>
                            Price: {activeVariant.price} LE
                        </p>

                        {activeVariant.offer > 0 && (
                            <div className="w-full flex items-center gap-4">
                                <span className="text-sm text-green-600 font-semibold">Offer: {activeVariant.offer}%</span>
                                <span className="text-xl font-bold text-main-3">
                                    {(Number(activeVariant.price) - (Number(activeVariant.price) * Number(activeVariant.offer)) / 100).toFixed(2)} LE
                                </span>
                            </div>
                        )}

                        {/* Sizes */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            {activeVariant.sizes.map((sizeObj, idx) => (
                                <button
                                    key={idx}
                                    disabled={sizeObj.stock === 0}
                                    onClick={() => setSelectedSize(sizeObj.size)}
                                    className={clsx(
                                        "text-xs px-2 py-1 rounded border",
                                        sizeObj.stock > 0 ? "bg-main-3 text-main-2" : "bg-gray-200 text-gray-500 cursor-not-allowed",
                                        selectedSize === sizeObj.size && "ring-2 ring-main-1"
                                    )}
                                >
                                    {sizeObj.size}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center container">
                            {services.map((service, index) => (
                                <ServiceCard key={index} icon={service.icon} title={service.title} />
                            ))}
                        </div>

                        <div className="flex items-center justify-end mt-8">
                            <CommonWhatsapp
                                productId={product.id}
                                title={product.title}
                                subCategory={product.subCategory.title}
                                size={selectedSize as string}
                                color={activeVariant.color} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
