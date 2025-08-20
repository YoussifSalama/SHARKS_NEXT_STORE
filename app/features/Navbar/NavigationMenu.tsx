"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
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
    subCategories: SubCategory[];
};

export function NavigationMenuMain({
    data,
    flow
}: {
    data: CategoryWithSubs[];
    flow: boolean;
}) {
    return (
        <nav className="flex items-center capitalize">
            <ul className="container flex">
                <ShopMenu categories={data} />
                <AboutUs />
                <ContactUs />
                <StoreLocation />
            </ul>
        </nav>
    );
}

const ShopMenu = ({ categories }: { categories: CategoryWithSubs[] }) => {
    const [hovered, setHovered] = useState(false);
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <li
            className="relative px-5 py-2.5 flex gap-2 items-center text-lg cursor-pointer hover:bg-main-2 transition-colors duration-300"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={hovered}
        >
            <span className={clsx("text-xl", textColorClass)}>Shop</span>
            <ChevronDown
                className={clsx(
                    "w-4 h-4 transition-transform duration-300",
                    hovered && "rotate-180",
                    textColorClass
                )}
            />
            <div
                className={clsx(
                    "absolute top-[84%] left-0 mt-2 bg-main-2 shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
                    hovered
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-4 pointer-events-none"
                )}
            >
                <ShopListMenu categories={categories} hovered={hovered} />
            </div>
        </li>
    );
};

const AboutUs = () => {
    const [hovered, setHovered] = useState(false);
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <Link href="/pages/about-us">
            <li
                className="relative px-5 py-2.5 flex gap-2 items-center text-lg cursor-pointer hover:bg-main-2 transition-colors duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-expanded={hovered}
            >
                <span className={clsx("text-xl", textColorClass)}>About Us</span>
            </li>
        </Link>
    );
};
const StoreLocation = () => {
    const [hovered, setHovered] = useState(false);
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <Link href="/pages/store-location">
            <li
                className="relative px-5 py-2.5 flex gap-2 items-center text-lg cursor-pointer hover:bg-main-2 transition-colors duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-expanded={hovered}
            >
                <span className={clsx("text-xl", textColorClass)}>Store Location</span>
            </li>
        </Link>
    );
};

const ContactUs = () => {
    const [hovered, setHovered] = useState(false);
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <Link href="/pages/contact-us">
            <li
                className="relative px-5 py-2.5 flex gap-2 items-center text-lg cursor-pointer hover:bg-main-2 transition-colors duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-expanded={hovered}
            >
                <span className={clsx("text-xl", textColorClass)}>Contact Us</span>
            </li>
        </Link>
    );
};

const ShopListMenu = ({ categories, hovered }: { categories: CategoryWithSubs[], hovered: boolean }) => {
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <div className={clsx("min-w-[250px] py-4 px-6 flex gap-12 text-nowrap", textColorClass)}>
            {categories.map((cat) => (
                <div key={cat.id} className={clsx("mb-3 *:transition-all *:duration-900", `${hovered ? "*:translate-y-0" : "*:translate-y-4"}`)}>
                    <span
                        className={clsx(
                            "font-semibold py-2 block w-fit relative after:content-[''] after:h-[2px] after:w-0 after:bg-main-3 after:absolute after:bottom-2 after:left-0 hover:after:w-full after:transition-all after:duration-300",
                            textColorClass
                        )}
                    >
                        {cat.title}
                    </span>
                    <ul className={clsx("*:transition-all *:duration-1000", `${hovered ? "*:translate-y-0" : "*:translate-y-2"}`)}>
                        {cat.subCategories.map((sub) => (
                            <li key={sub.id}>
                                <Link
                                    href={`/shop/collections/${makeSlug(sub.title)}?subId=${sub.id}`}
                                    className={clsx("block py-1 hover:ml-1 transition-normal duration-300", textColorClass)}
                                >
                                    {sub.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <SubCategoryCard subCategory={categories[0].subCategories[0]} hovered={hovered} />
        </div>
    );
};

const SubCategoryCard = ({ subCategory, hovered }: { subCategory: SubCategory, hovered: boolean }) => {
    const textColorClass = hovered ? "text-main-3" : "text-current";

    return (
        <div className={clsx("w-xs h-auto space-y-2 *:transition-all *:duration-900", `${hovered ? "*:translate-y-0" : "*:translate-y-4"}`, textColorClass)}>
            <img src={subCategory.img} alt={subCategory.title} className="w-xs h-xs shadow-md object-cover" />
            <p className={clsx("text-center duration-900", `${hovered ? "*:translate-y-0" : "*:translate-y-2"}`)}>{subCategory.title}</p>
            <p className={clsx("opacity-85 text-center text-xs duration-900", `${hovered ? "*:translate-y-0" : "*:translate-y-2"}`)}>{subCategory.slogan}</p>
        </div>
    );
};
