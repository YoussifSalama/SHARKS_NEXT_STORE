"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const HandleHeroSubmit = async (img: string, action: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("sharktoken")?.value;
        if (!token) {
            return {
                ok: false,
                message: "Session expired, please login again",
            };
        }

        const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
        if (!isTokenValid) {
            return {
                ok: false,
                message: "Session expired, please login again",
            };
        }

        const more = await prisma.more.findFirst();

        if (!more) {
            await prisma.more.create({
                data: {
                    hero: {
                        do: action,
                        img: img,
                    },
                    productsFeatures: [],
                    globalFeatures: [],
                    offerCard: {},
                },
            });
        } else {
            await prisma.more.update({
                where: { id: more.id },
                data: {
                    hero: {
                        do: action,
                        img: img,
                    },
                    productsFeatures: more.productsFeatures || [],
                    globalFeatures: more.globalFeatures || [],
                    offerCard: more.offerCard || {},
                },
            });
        }

        return {
            ok: true,
            message: "Hero section updated successfully.",
        };
    } catch (error: any) {
        console.error("HandleHeroSubmit error:", error);
        return {
            ok: false,
            message: "Something went wrong!",
        };
    }
};


export const getHero = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("sharktoken")?.value;
    if (!token) {
        return {
            ok: false,
            message: "Session expired, please login again",
        };
    }

    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!isTokenValid) {
        return {
            ok: false,
            message: "Session expired, please login again",
        };
    }
    const more = await prisma.more.findFirst();

    const hero = more?.hero;
    if (!more) {
        return {
            ok: false,
            message: "Hero not found"
        }
    }
    else if (more && !hero) {
        return {
            ok: false,
            message: "Hero not found"
        }
    }
    return {
        ok: true,
        message: "Hero Found",
        data: hero
    }
}