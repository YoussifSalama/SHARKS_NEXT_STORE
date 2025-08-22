"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

function makeSlug(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

type SubCategory = {
    id: number;
    title: string;
    slogan: string;
    img: string;
};

type CategoryWithSubs = {
    id: number;
    title: string;
    img: string;
    subCategories: SubCategory[];
};

type NavbarMobProps = {
    data: CategoryWithSubs[];
};

const NavbarMob = ({ data }: NavbarMobProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

    const toggleSidebar = () => setIsOpen(!isOpen);
    const toggleExpand = (id: number) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const formattedData: CategoryWithSubs[] = data.map(cat => ({
        id: cat.id,
        title: cat.title,
        img: (cat.img as string) || "",
        subCategories: cat.subCategories.map(sub => ({
            id: sub.id,
            title: sub.title,
            slogan: sub.slogan,
            img: (sub.img as string) || "",
        })),
    }));

    return (
        <div className="lg:hidden relative">
            <button
                onClick={toggleSidebar}
                className="p-4 fixed top-4 left-4 z-20 bg-main-3/60 text-main-2 rounded-sm shadow-md"
            >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-64 bg-main-2 shadow-lg transform transition-transform duration-300 z-10",
                    isOpen ? "translate-x-0" : "translate-x-full","pt-12"
                )}
            >
                <ul className="flex flex-col p-6 gap-2">
                    {/* Shop main button */}
                    <li>
                        <div
                            className="flex justify-between items-center cursor-pointer py-2 px-1 font-semibold text-lg"
                            onClick={() => setShopOpen(!shopOpen)}
                        >
                            <span>Shop</span>
                            <ChevronDown className={clsx("w-4 h-4 transition-transform", shopOpen && "rotate-180")} />
                        </div>

                        {shopOpen && (
                            <ul className="ml-2 mt-2 flex flex-col gap-1">
                                {formattedData.map(cat => (
                                    <li key={cat.id}>
                                        <div
                                            className="flex justify-between items-center cursor-pointer py-1 px-2"
                                            onClick={() => toggleExpand(cat.id)}
                                        >
                                            <span className="font-medium">{cat.title}</span>
                                            {cat.subCategories.length > 0 && (
                                                <ChevronDown
                                                    className={clsx(
                                                        "w-4 h-4 transition-transform",
                                                        expandedItems[cat.id] && "rotate-180"
                                                    )}
                                                />
                                            )}
                                        </div>

                                        {cat.subCategories.length > 0 && expandedItems[cat.id] && (
                                            <ul className="ml-4 mt-1 flex flex-col gap-1">
                                                {cat.subCategories.map(sub => (
                                                    <li key={sub.id}>
                                                        <Link
                                                            href={`/shop/collections/${makeSlug(sub.title)}?subId=${sub.id}`}
                                                            className="block py-1 text-sm text-current"
                                                        >
                                                            {sub.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* About Us */}
                    <li className="mt-4">
                        <Link href="/pages/about-us" className="block py-1 text-lg font-medium text-current">
                            About Us
                        </Link>
                    </li>
                    <li className="mt-4">
                        <Link href="/pages/contact-us" className="block py-1 text-lg font-medium text-current">
                            Contact Us
                        </Link>
                    </li>
                     <li className="mt-4">
                        <Link href="/pages/store-location" className="block py-1 text-lg font-medium text-current">
                            Store Location
                        </Link>
                    </li>
                </ul>
            </div>

            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/10 z-5"
                />
            )}
        </div>
    );
};

export default NavbarMob;
