"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigationMenuMain } from "./NavigationMenu";
import Link from "next/link";
import clsx from "clsx";
import Header from "../header/Header";

const Navbar = ({ data, home }: { data: any, home?: boolean }) => {
    const [flow, setFlow] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setFlow(true);
            } else {
                setFlow(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const fixedColor = (home !== undefined) && home == false;

    return (
        <div className={clsx(`${(fixedColor && flow) ? "bg-main-3 text-main-2" : flow ? "bg-main-3 text-main-2" : "bg-main-2 text-main-3"}`, "relative z-10")}>
            <Header phone="201015739888" />

            <nav
                className={cn(
                    "py-8 z-10",
                    `${flow ? "fixed top-0 left-0 w-full bg-main-3" : ""}`
                )}
            >

                <div className={clsx("container flex items-center justify-between px-10")}>
                    <Link href="/">
                        <h1 className="text-2xl">
                            Sharks
                        </h1>
                    </Link>
                    <div className="w-full max-lg:hidden">
                        <NavigationMenuMain data={data} flow={flow} />
                    </div>
                    <Link href={"/shop/products"} className="*:w-4 *:h-4 flex items-center gap-8">
                        {/* search */}
                        <span>
                            <Search className="w-6 h-6 font-light" />
                        </span>
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
