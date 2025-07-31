"use client";

import { ChartBarStacked, House, LogOut, Menu, Shirt } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type SidebarType = {
    id: number;
    name: string;
    href: string;
    icon: React.ReactNode;
};

const MobilSideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [openNav, setOpenNav] = useState(false);
    const routes: SidebarType[] = [
        {
            id: 1,
            name: "Home",
            href: "/sharks-dashboard-2025",
            icon: <House className="w-6 h-6" />,
        },
        {
            id: 2,
            name: "Categories",
            href: "/sharks-dashboard-2025/categories",
            icon: <ChartBarStacked className="w-6 h-6" />,
        },
        {
            id: 3,
            name: "Products",
            href: "/sharks-dashboard-2025/products",
            icon: <Shirt className="w-6 h-6" />,
        },
    ];

    return (
        <>
            {/* Menu Toggle Button */}
            <button
                className="fixed top-4 right-4 z-50 rounded-md bg-white p-2 shadow-md"
                onClick={() => setOpenNav(!openNav)}
                aria-label={openNav ? "Close sidebar menu" : "Open sidebar menu"}
                type="button"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay behind sidebar when open */}
            {openNav && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-40 z-40"
                    onClick={() => setOpenNav(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar sliding panel */}
            <aside
                className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${openNav ? "translate-x-0" : "translate-x-full"}
          flex flex-col p-4
        `}
            >
                {/* Navigation */}
                <nav className="flex flex-col gap-4 flex-grow overflow-y-auto">
                    {routes.map((route) => {
                        const isActive = route.href == pathname;
                        return <Link
                            key={route.id}
                            href={route.href}
                            className={`flex items-center gap-3 p-2  border rounded-md hover:bg-gray-100 transition-colors
                                ${isActive && "shadow-md"}
                                `}
                            onClick={() => setOpenNav(false)}
                        >
                            {route.icon}
                            <span className="text-md font-medium">{route.name}</span>
                        </Link>
                    })}
                </nav>

                {/* Logout Button */}
                <button
                    className="flex items-center gap-3 p-2 mt-auto hover:bg-gray-100 transition-colors border rounded-md"
                    onClick={() => {
                        Cookies.remove("sharktoken");
                        router.refresh();
                    }}
                    type="button"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="text-md font-medium">Logout</span>
                </button>
            </aside>
        </>
    );
};

export default MobilSideBar;
