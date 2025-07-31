"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getAnalyticsCounts = async () => {
    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) {
        return {
            ok: false,
            message: "Session expired, please login again"
        }
    }
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isTokenValid) {
        return {
            ok: false,
            message: "Session expired, please login again",
        }
    }
    const productsCount = await prisma.product.count();
    const categoriesCount = await prisma.category.count();
    const subCategoriesCount = await prisma.subCategory.count();
    return {
        ok: true,
        message: "Analytics counts fetched successfully",
        data: {
            totalProducts: productsCount,
            totalCategories: categoriesCount,
            totalSubCategories: subCategoriesCount,
        }
    }
};