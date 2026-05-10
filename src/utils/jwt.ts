// Import the jsonwebtoken library
import jwt from "jsonwebtoken";
import { isDevelopment, JWT_SECRET } from "../config/index.ts";
import express from "express";

type PayloadType = {
    id: string;
    email: string;
}

export const createToken = (payload: PayloadType, res: express.Response, tokenName: string, expiresIn: number = 3600*24) => {
    const token = jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: expiresIn},
    );

    res.cookie(tokenName, token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: !isDevelopment,
    });

    return token;
}