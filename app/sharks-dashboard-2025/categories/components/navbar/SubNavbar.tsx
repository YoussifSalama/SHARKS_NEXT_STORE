"use client";

import { ArrowLeftCircle, CirclePlus, House } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type NavbarRoutesType = {
    id: number;
    name: string;
    href: string;
    icon: React.ReactNode;
};

const SubNavbar = ({ }) => {
    const pathname = usePathname();
    const { categoryId } = useParams();
    const routes: NavbarRoutesType[] = [
        {
            id: 1,
            name: "Home",
            href: "/sharks-dashboard-2025/categories/" + categoryId + "/sub-categories",
            icon: <House className="w-4 h-4 mr-2" />,
        },
        {
            id: 2,
            name: "Add Sub Category",
            href: "/sharks-dashboard-2025/categories/" + categoryId + "/sub-categories/add",
            icon: <CirclePlus className="w-4 h-4 mr-2" />,
        },
    ];

    return (
        <nav>
            <ul className="flex text-sm font-medium">
                <Link
                    href="/sharks-dashboard-2025/categories"
                    aria-current={"page"}
                    className={`flex items-center px-4 py-2 rounded-t-md border transition-all

                        text-gray-500 hover:text-black hover:bg-gray-100
                        
                       `}
                >
                    <ArrowLeftCircle className="w-4 h-4 mr-2" />
                    {"Categories"}
                </Link>
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

export default SubNavbar;
