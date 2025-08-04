"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


interface SubCategoryInterface {
    title: string;
    slogan: string;
    description: string;
    img: string
}

export const addNewSubCategory = async (data: SubCategoryInterface, categoryId: number) => {
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
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId
        }
    });
    if (!category) {
        return {
            ok: false,
            message: "Failed to add new sub category, category not found."
        }
    }
    const { title, slogan, description, img } = data;
    const addedSubCategory = await prisma.subCategory.create({
        data: {
            title,
            description,
            img,
            slogan,
            category: {
                connect: { id: categoryId }
            }
        }
    });
    if (!addedSubCategory) {
        return {
            ok: false,
            message: "Failed to add new sub category."
        }
    }
    else {
        return {
            ok: true,
            message: "New sub category was created successfully"
        }
    }
}



export const getAllSubCategories = async (
    page: number = 1,
    limit: number = 10,
    orderBy: "asc" | "desc" = "asc",
    categoryId?: number,
    search?: string,
    select?: string[]
) => {
    const skip = (page - 1) * limit;
    const searchTerm = search?.length ? search : undefined;

    let searchObj: any = {};
    if (searchTerm) {
        searchObj = {
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { slogan: { contains: searchTerm, mode: "insensitive" } }
            ]
        }
    }
    if (categoryId) {
        searchObj.categoryId = categoryId;
    }

    let selectObj: { [key: string]: boolean } = {};
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
        prisma.subCategory.findMany(queryOptions),
        prisma.subCategory.count({ where: searchObj }),
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


export const deleteOneSubCategory = async (id: number) => {
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
        const deletedCategory = await prisma.subCategory.delete({
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
            message: "Sub category deleted successfully",
        };
    }
    catch (error) {
        return {
            ok: false,
            message: "Failed to delete category",
        };
    }
}

export const updateOneSubCategory = async (id: number, data: SubCategoryInterface) => {
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
        const updatedCategory = await prisma.subCategory.update({
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
                message: "Failed to update sub category",
            };
        }
        return {
            ok: true,
            message: "Sub category updated successfully",
            category: updatedCategory,
        };
    }
    catch (error) {
        return {
            ok: false,
            message: "Failed to update sub category",
        };
    }
}