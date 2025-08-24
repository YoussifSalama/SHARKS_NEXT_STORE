"use client";

import React from "react";

interface CommonWhatsappProps {
    productId: number;
    title: string;
    subCategory: string;
    size?: string;
    color?: string;
    phoneNumber?: string;
    onClick: Function;
    disabled?: boolean;
}

const CommonWhatsapp: React.FC<CommonWhatsappProps> = ({
    onClick,
    productId,
    title,
    subCategory,
    size,
    phoneNumber = "201015739888",
    color,
    disabled
}) => {
    const message = encodeURIComponent(
        `Hello, I am interested in this product:\n\nProduct: ${title}\nSubCategory: ${subCategory}\nProduct ID: ${productId}` +
        (size ? `\nSize: ${size}` : "") + (color ? `\nColor: ${color}` : "")
    );

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={disabled ? undefined : whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { if (!disabled) onClick(productId) }}
            className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded transition
                ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-5 h-5"
            />
            Contact via WhatsApp
        </a>
    );
};

export default CommonWhatsapp;
