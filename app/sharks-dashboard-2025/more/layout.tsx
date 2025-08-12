"use client";

import Navbar from "./components/navbar/Navbar";

const MoreLayout = ({ children }: { children: React.ReactNode }) => {
    return (<main>
        {/* navbar */}
        {
            <Navbar />
        }
        {/* content */}
        <div className="p-4 border rounded-b-md rounded-tr-md h-full shadow-md">
            {children}
        </div>
    </main>);
}

export default MoreLayout;