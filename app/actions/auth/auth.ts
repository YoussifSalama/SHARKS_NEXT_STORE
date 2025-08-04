"use server"
import jwt from "jsonwebtoken";

export const login = async (data: { key: string; password: string }) => {
    const { key, password } = data;
    const admin = process.env.DASHBOARD_ADMIN;
    const jwtSecret = process.env.JWT_SECRET;

    if (!admin || !jwtSecret) {
        return {
            ok: false,
            message: "Failed to get admin credentials or JWT secret!"
        };
    }

    const [adminKey, adminPassword] = admin.split("*");

    if (key === adminKey && password === adminPassword) {
        const token = jwt.sign({ key }, jwtSecret, { expiresIn: "24h" });

        return {
            ok: true,
            token,
            message: "Login successful"
        };
    } else {
        return {
            ok: false,
            message: "Login failed"
        };
    }
};


export const verifyToken = async (token: string) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return {
            ok: false,
            message: "JWT secret is not defined"
        };
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        return {
            ok: true,
            decoded
        };
    } catch (error) {
        return {
            ok: false,
            message: "Invalid token"
        };
    }
}