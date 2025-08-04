import React, { createContext, useState } from "react";

type CategoryDataType = {
    id: number;
    title: string;
    img: string;
    description: string;
};

interface CategoryStore {
    data: CategoryDataType | null;
    setData: React.Dispatch<React.SetStateAction<CategoryDataType | null>>;
}

const CategoryContext = createContext<CategoryStore | null>(null);

const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<CategoryDataType | null>(null);

    return (
        <CategoryContext.Provider value={{ data, setData }}>
            {children}
        </CategoryContext.Provider>
    );
};

export { CategoryContext };
export default CategoryProvider;
