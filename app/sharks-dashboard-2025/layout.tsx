"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Cookies from "js-cookie";
import Loader from "./features/Loader";
import { usePathname, useRouter } from "next/navigation";
import MobilSideBar from "./components/sidebar/MobilSideBar";

const SharksDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isClient, setIsClient] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [loadingToken, setLoadingToken] = useState(true);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(true);

    const pathname = usePathname();
    const router = useRouter();

    const handleSidebarMouseEnter = useCallback(() => setIsSidebarHovered(true), []);
    const handleSidebarMouseLeave = useCallback(() => setIsSidebarHovered(false), []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const getToken = () => {
            const currentToken = Cookies.get("sharktoken");
            setToken(currentToken);
            setLoadingToken(false);
        };

        getToken();

        const interval = setInterval(() => {
            const updatedToken = Cookies.get("sharktoken");
            setToken(updatedToken);
        }, 500);

        return () => clearInterval(interval);
    }, [isClient]);

    useEffect(() => {
        if (!loadingToken) {
            if (!token && !pathname.includes("/login")) {
                router.push("/sharks-dashboard-2025/login");
            }
        }
    }, [loadingToken, token, pathname, router]);

    useEffect(() => {
        if (!isClient) return;

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1280);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    if (!isClient || loadingToken) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader classname="w-[4rem] h-[4rem]" />
            </div>
        );
    }

    const isAuthenticated = !!token;

    return (
        <main className="h-screen">
            {isAuthenticated ? (
                isDesktop ? (
                    // Desktop layout
                    <div className="h-full flex w-full relative">
                        <div
                            className={`h-screen fixed top-0 left-0 transition-all duration-300 ${isSidebarHovered ? "w-[12%]" : "w-[5%]"
                                }`}
                            onMouseEnter={handleSidebarMouseEnter}
                            onMouseLeave={handleSidebarMouseLeave}
                        >
                            <Sidebar isSidebarHovered={isSidebarHovered} />
                        </div>
                        <div
                            className={`h-full transition-all duration-300 shadow-inner ${isSidebarHovered ? "w-[88%] ml-[12%]" : "w-[95%] ml-[5%]"
                                } p-4`}
                        >
                            {children}
                        </div>
                    </div>
                ) : (
                    // Mobile layout
                    <div className="p-4 relative h-full w-full flex flex-col">
                        <div>
                            <MobilSideBar />
                        </div>
                        <div className="w-full ">{children}</div>
                    </div>
                )
            ) : (
                // If not authenticated
                <div className="p-4 h-full">{children}</div>
            )}
        </main>
    );

};

export default SharksDashboardLayout;
