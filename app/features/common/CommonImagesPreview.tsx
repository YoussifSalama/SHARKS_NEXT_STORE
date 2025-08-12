"use client";

import { useState } from "react";

export const CommonImagesPreview = ({images}:{images:string[]}) => {


    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative w-[350px] h-[350px] overflow-hidden border">
            <img
                src={images[activeIndex]}
                alt={`img-${activeIndex}`}
                className="w-full h-full object-cover transition-all duration-500"
            />

            <div className="absolute inset-0 flex">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 cursor-pointer"
                        onMouseEnter={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};
