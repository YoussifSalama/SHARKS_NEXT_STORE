"use client";

import { ChartBarStacked, House, LogOut, Shirt } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";


type SidebarType = {
    id: number,
    name: string,
    href: string,
    icon: React.ReactNode
}

const Sidebar = ({ isSidebarHovered }: { isSidebarHovered: boolean }) => {
    const router = useRouter();
    const pathname = usePathname();
    const routes: SidebarType[] = [
        {
            id: 1,
            name: "Home",
            href: "/sharks-dashboard-2025",
            icon: <House className="w-6 h-4" />
        },
        {
            id: 2,
            name: "Categories",
            href: "/sharks-dashboard-2025/categories",
            icon: <ChartBarStacked className="w-6 h-4" />
        },
        {
            id: 3,
            name: "Products",
            href: "/sharks-dashboard-2025/products",
            icon: <Shirt className="w-6 h-4" />
        }
    ]
    return (<aside className="w-full h-full flex flex-col overflow-hidden p-4 shadow-md rounded-r-md">
        {/* routes */}
        <nav>
            <ul className="flex flex-col gap-2 *:rounded-md">
                {routes?.map((route) => {
                    const isActive = route.href == pathname;

                    return <Link key={route.id} href={route.href} className={`flex gap-2  border p-2 text-md transition-all duration-300   ${isActive && "shadow-md"}
                    ${isSidebarHovered ? "items-center justify-start" : "items-center justify-center"}
                    `}>
                        <span className={`${isSidebarHovered ? "w-auto" : "w-full"}`}>{route.icon}</span>
                        <span className={`${isSidebarHovered ? "opacity-100 w-auto" : "opacity-0 w-0"} transition-opacity duration-300`}>{route.name}</span>
                    </Link>
                })}
            </ul>
        </nav>
        {/* seettings*/}
        <div className="mt-auto *:w-full *:rounded-md">
            <button className={`flex gap-2  items-center justify-start border p-2`}
                onClick={() => {
                    Cookies.remove("sharktoken");
                    router.refresh();
                }}
            >
                <span><LogOut className="w-6 h-4" /></span>
                <span className={`${isSidebarHovered ? "opacity-100" : "opacity-0 "} transition-opacity duration-300`}>Logout</span>
            </button>
        </div>
    </aside>);
}

export default Sidebar;