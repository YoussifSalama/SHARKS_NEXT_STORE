// home page
/*
 * newest sub category
 * slider of 10 products (related to the newest sub cat)
 * sale
 * random sub cat
 * random sub cat
 * random sub cat
 * random sub cat
 * product (+++++++++++++++++)
 * features
 */

import { prisma } from "@/lib/prisma"

export const getHomeData = async () => {
    const newestSubCategory = await prisma.subCategory.findFirst({
        orderBy: {
            createdAt: "asc",
        },
    });

    if (!newestSubCategory)
        return {
            ok: false,
            message: "Failed on 1st stage.",
        };


    const product = await prisma.product.findMany({
        orderBy: {
            createdAt: "asc"
        },
        include: {
            variants: {
                include: {
                    imgs: true
                }
            }
        },
        take: 2
    });


    const randomSubCategory = await prisma.subCategory.findMany({
        take: 5,
    });

    const more = await prisma.more.findFirst();

    return {
        ok: true,
        message: "success",
        section1: newestSubCategory,
        section2: product,
        offer: more?.offerCard,
        rest: randomSubCategory,
    };
};
