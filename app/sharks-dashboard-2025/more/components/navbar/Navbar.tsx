"use client";

import { CirclePlus, Image } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarRoutesType = {
    id: number;
    name: string;
    href: string;
    icon: React.ReactNode;
};

const Navbar = () => {
    const pathname = usePathname();
    const routes: NavbarRoutesType[] = [
        {
            id: 1,
            name: "Hero",
            href: "/sharks-dashboard-2025/more",
            icon: <Image className="w-4 h-4 mr-2" />,
        },
        {
            id: 2,
            name: "Global Features Cards",
            href: "/sharks-dashboard-2025/more/global-features",
            icon: <CirclePlus className="w-4 h-4 mr-2" />,
        },
        {
            id: 3,
            name: "Products Features Cards",
            href: "/sharks-dashboard-2025/more/products-features",
            icon: <CirclePlus className="w-4 h-4 mr-2" />,
        },
        {
            id: 4,
            name: "Global Offer Card",
            href: "/sharks-dashboard-2025/more/global-offer",
            icon: <CirclePlus className="w-4 h-4 mr-2" />,
        },
    ];

    return (
        <nav>
            <ul className="flex text-sm font-medium">
                {routes.map((route) => {
                    const isActive = pathname === route.href;

                    return (
                        <li key={route.id}>
                            <Link
                                href={route.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex items-center px-4 py-2 rounded-t-md border transition-all ${isActive
                                    ? "bg-white text-black"
                                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                                    }`}
                            >
                                {route.icon}
                                {route.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;
