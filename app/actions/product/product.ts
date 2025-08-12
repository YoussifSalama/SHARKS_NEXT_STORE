"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

type VariantType = {
    color: string;
    stock: number;
    sizes: string[];
    price: number;
    imgs: string[];
    offer: number;
    coverIndex?: number;
};

interface ProductInterface {
    title: string;
    description: string;
    status: "active" | "inActive" | "draft" | "all",
    variants: VariantType[];
    categoryId: number;
    subCategoryId: number;
}

export const addNewProduct = async (data: ProductInterface) => {
    const { title, description, variants, categoryId, subCategoryId, status } = data;


    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) return { ok: false, message: "Session expired, please login again" };

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
        return { ok: false, message: "Session expired, please login again" };
    }

    const [findSubCategory, findCategory] = await Promise.all([
        prisma.subCategory.findFirst({ where: { id: subCategoryId } }),
        prisma.category.findFirst({ where: { id: categoryId } }),
    ]);

    if (!findSubCategory || !findCategory) return { ok: false, message: "Category or SubCategory not found." };

    const newProduct = await prisma.product.create({
        data: {
            title,
            description,
            subCategoryId,
            status
        },
    });

    if (!newProduct) return { ok: false, message: "Failed to add new product." };

    for (const variant of variants) {
        const createdVariant = await prisma.variant.create({
            data: {
                color: variant.color,
                offer: variant.offer,
                sizes: variant.sizes,
                productId: newProduct.id,
                price: variant.price ?? 0,
            },
        });

        if (variant.imgs.length > 0) {
            const imgsData = variant.imgs.map((url) => ({
                url,
                variantId: createdVariant.id,
            }));

            await prisma.img.createMany({ data: imgsData });
        }
    }

    return { ok: true, message: "Product added successfully" };
};


export const getAllProducts = async (
    page: number = 1,
    limit: number = 10,
    sort: "asc" | "desc" = "desc",
    status: "active" | "inActive" | "draft" | "all" = "all",
    search?: string,
    select?: {
        product?: string[],
        variants?: string[],
        imgs?: number
    }
) => {
    const pageNo = page || 1;
    const limitNo = limit || 10;
    const skipNo = (pageNo - 1) * limitNo;


    let where: any = {};

    if (search && search.trim().length > 0) {
        const searchNum = Number(search);
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { variants: { some: { color: { contains: search, mode: "insensitive" } } } },
            ...(isNaN(searchNum) ? [] : [{ variants: { some: { price: searchNum } } }])
        ];
    }

    if (status && status.length > 0 && status !== "all") {
        where.status = status;
    }


    let productSelect: any = undefined;
    if (select?.product?.length) {
        productSelect = {};
        for (const field of select.product) {
            productSelect[field] = true;
        }
    }

    let variantsSelect: any = undefined;
    if (select?.variants?.length) {
        variantsSelect = {};
        for (const field of select.variants) {
            if (field === "stock" || field === "size" || field === "price") {
                continue;
            }
            variantsSelect[field] = true;
        }
    }


    let imgsInclude: any = true;
    if (select?.imgs && select.imgs > 0) {
        imgsInclude = {
            take: select.imgs,
            select: { id: true, url: true }
        };
    }

    let variantsInclude: any = undefined;
    if (variantsSelect) {
        variantsInclude = {
            select: {
                ...variantsSelect,
                imgs: imgsInclude
            }
        };
    } else {
        variantsInclude = {
            include: {
                imgs: imgsInclude
            }
        };
    }


    let queryOptions: any = {
        skip: skipNo,
        take: limitNo,
        where,
        orderBy: { createdAt: sort }
    };

    if (productSelect) {
        queryOptions.select = {
            ...productSelect,
            variants: variantsInclude
        };
    } else {
        queryOptions.include = {
            variants: variantsInclude
        };
    }

    const [products, total] = await Promise.all([
        prisma.product.findMany(queryOptions),
        prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNo);

    return {
        data: products,
        meta: {
            page: pageNo,
            limit: limitNo,
            total,
            totalPages,
            hasNext: pageNo < totalPages,
            hasPrev: pageNo > 1,
        },
    };
};


export const getOneProduct = async (productId: number) => {
    if (!productId) return {
        ok: false,
        message: "Something went wrong."
    }
    const product = await prisma.product.findFirst({
        where: {
            id: productId
        },
        include: {
            variants: {
                include: {
                    imgs: true
                }
            },
            subCategory: {
                include: {
                    category: true
                }
            }
        }
    });
    if (!product) return {
        ok: false,
        message: "Product not found."
    }
    return {
        ok: true,
        message: "Success",
        data: product
    }
}


export const updateProduct = async (productId: number, data: ProductInterface) => {
    const { title, description, variants, categoryId, subCategoryId, status } = data;

    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) return { ok: false, message: "Session expired, please login again" };

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
        return { ok: false, message: "Session expired, please login again" };
    }

    const [findSubCategory, findCategory] = await Promise.all([
        prisma.subCategory.findFirst({ where: { id: subCategoryId } }),
        prisma.category.findFirst({ where: { id: categoryId } }),
    ]);

    if (!findSubCategory || !findCategory)
        return { ok: false, message: "Category or SubCategory not found." };

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) return { ok: false, message: "Product not found." };

    await prisma.product.update({
        where: { id: productId },
        data: {
            title,
            description,
            subCategoryId,
            status,
        },
    });

    await prisma.img.deleteMany({
        where: { variant: { productId } },
    });
    await prisma.variant.deleteMany({
        where: { productId },
    });

    for (const variant of variants) {
        const createdVariant = await prisma.variant.create({
            data: {
                color: variant.color,
                sizes: variant.sizes,
                offer: variant.offer,
                productId,
                price: variant.price ?? 0,
            },
        });

        if (variant.imgs.length > 0) {
            const imgsData = variant.imgs.map((url) => ({
                url,
                variantId: createdVariant.id,
            }));
            await prisma.img.createMany({ data: imgsData });
        }
    }

    return { ok: true, message: "Product updated successfully" };
};


export const deleteProduct = async (productId: number) => {
    const token = (await cookies()).get("sharktoken")?.value;
    if (!token) return { ok: false, message: "Session expired, please login again" };

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
        return { ok: false, message: "Session expired, please login again" };
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!existingProduct) return { ok: false, message: "Product not found." };

    await prisma.product.delete({
        where: { id: productId },
    });

    return { ok: true, message: "Product deleted successfully" };
};


export const getRandomProduct = async () => {
    const productCount = await prisma.product.count();
    const randomSkip = Math.floor(Math.random() * productCount);
    const product = await prisma.product.findFirst({
        skip: randomSkip
    })

    return {
        ok: true,
        data: product
    }
}

export const getRandomProductOnSubCat = async (subCategoryId: number) => {
    if (!subCategoryId) return { ok: false, message: "Sub category id is require." }
    const subCatNo = Number(subCategoryId);
    const productCount = await prisma.product.count();
    const randomSkip = Math.floor(Math.random() * productCount);
    const product = await prisma.product.findFirst({
        skip: randomSkip,
        where: {
            subCategoryId: subCatNo
        }
    })

    return {
        ok: true,
        data: product
    }
}