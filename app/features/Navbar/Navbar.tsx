"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigationMenuMain } from "./NavigationMenu";
import Link from "next/link";
import clsx from "clsx";
import Header from "../header/Header";

const Navbar = ({ data }: { data: any }) => {
    const [flow, setFlow] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
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

    return (
        <div >
            <Header route={{ title: "Contact Us", href: "/contact-us" }} />

            <nav
                className={cn(
                    "py-8 z-10",
                    `${flow ? "fixed top-0 left-0 w-full bg-main-3" : ""}`
                )}
            >

                <div className={clsx("container flex items-center justify-between px-10 text-main-2")}>
                    <Link href="/">
                        <h1 className="text-2xl">
                            Sharks
                        </h1>
                    </Link>
                    <div className="w-full">
                        <NavigationMenuMain data={data} flow={flow} />
                    </div>
                    <div className="*:w-4 *:h-4 flex items-center gap-8">
                        {/* search */}
                        <span>
                            <Search className="w-6 h-6 font-light" />
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
