"use client";

import { useParams } from "next/navigation";
import Navbar from "./components/navbar/Navbar";
import CategoryProvider from "@/context/admin/StoreCategoryContext";

const Categorylayout = ({ children }: { children: React.ReactNode }) => {
    return (<main>
        {/* navbar */}
        {
            <Navbar />
        }
        {/* content */}
        <div className="p-4 border rounded-b-md rounded-tr-md h-full shadow-md">
            <CategoryProvider>
                {children}
            </CategoryProvider>
        </div>
    </main>);
}

export default Categorylayout;