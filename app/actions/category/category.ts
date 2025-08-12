"use server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface AddNewCategoryInterface {
    title: string;
    slogan: string;
    description: string;
    img: string;
}

export const addNewCategory = async (data: AddNewCategoryInterface) => {
    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isTokenValid) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    try {
        const { title, slogan, description, img } = data;
        if (!title || !slogan || !description || !img) {
            return {
                ok: false,
                message: "All fields are required",
            };
        }
        const newCategory = await prisma.category.create({
            data: {
                title,
                slogan,
                description,
                img
            }
        });
        if (!newCategory) {
            return {
                ok: false,
                message: "Failed to add new category",
            };
        }
        return {
            ok: true,
            message: "New category added successfully",
            category: newCategory,
        };
    }
    catch (error) {
        return {
            ok: false,
            message: "Failed to add new category",
        };
    }
}
export const getAllCategories = async (
    page: number = 1,
    limit: number = 10,
    orderBy: "asc" | "desc" = "asc",
    search?: string,
    select?: string[]
) => {
    const skip = (page - 1) * limit;
    const searchTerm = search?.length ? search : undefined;


    let searchObj = {};
    let selectObj: { [key: string]: boolean } = {};
    if (searchTerm) {
        searchObj = {
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { slogan: { contains: searchTerm, mode: "insensitive" } }
            ]
        }
    }
    if (select) {
        for (const field of select) {
            selectObj[field] = true;
        }
    }

    const queryOptions: any = {
        where: searchObj,
        skip,
        take: limit,
        orderBy: {
            updatedAt: orderBy,
        }
    }

    if (select && select.length > 0) {
        const selectObj: { [key: string]: boolean } = {};
        for (const field of select) {
            selectObj[field] = true;
        }
        queryOptions.select = selectObj;
    }

    const [categories, total] = await Promise.all([
        prisma.category.findMany(queryOptions),
        prisma.category.count({ where: searchObj }),
    ]);


    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
        data: categories,
        meta: {
            page,
            limit,
            total,
            totalPages,
            hasNext,
            hasPrev,
        },
    };
};

export const deleteOneCategory = async (id: number) => {
    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isTokenValid) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    try {
        const deletedCategory = await prisma.category.delete({
            where: {
                id
            }
        });
        if (!deletedCategory) {
            return {
                ok: false,
                message: "Failed to delete category",
            };
        }
        return {
            ok: true,
            message: "Category deleted successfully",
        };
    }
    catch (error) {
        return {
            ok: false,
            message: "Failed to delete category",
        };
    }
}

export const updateOneCategory = async (id: number, data: AddNewCategoryInterface) => {
    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isTokenValid) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    try {
        const { title, slogan, description, img } = data;
        if (!title || !slogan || !description || !img) {
            return {
                ok: false,
                message: "All fields are required",
            };
        }
        const updatedCategory = await prisma.category.update({
            where: {
                id
            },
            data: {
                title,
                slogan,
                description,
                img
            }
        });
        if (!updatedCategory) {
            return {
                ok: false,
                message: "Failed to update category",
            };
        }
        return {
            ok: true,
            message: "Category updated successfully",
            category: updatedCategory,
        };
    }
    catch (error) {
        return {
            ok: false,
            message: "Failed to update category",
        };
    }
}

export const getCategoriesandItsSubCategoriesForNavbar = async (
    limitForCats: number,
    limitForSubCats: number
) => {
    const categories = await prisma.category.findMany({
        take: Number(limitForCats),
        select: {
            id: true,
            title: true,
            img: true,
            subCategories: {
                take: Number(limitForSubCats),
                select: {
                    id: true,
                    title: true,
                    slogan: true,
                    img: true
                }
            }
        }
    });

    return {
        ok: true,
        data: categories
    };
};