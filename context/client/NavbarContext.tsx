"use client";

import { createContext, useState, ReactNode } from "react";

type SubCategory = {
    title: string;
    id: number;
    img: string;
    slogan: string;
};

interface Category {
    title: string;
    id: number;
    img: string;
    subCategories: SubCategory[];
}

interface NavbarContextType {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

const NavbarProvider = ({ children, initialCategories }: { children: ReactNode, initialCategories: Category[] }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    return (
        <NavbarContext.Provider value={{ categories, setCategories }}>
            {children}
        </NavbarContext.Provider>
    );
};

export { NavbarProvider };
export default NavbarContext;
