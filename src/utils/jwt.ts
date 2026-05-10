// Import the jsonwebtoken library
import jwt from "jsonwebtoken";
import { isDevelopment, JWT_SECRET } from "../config/index.ts";
import express from "express";

type PayloadType = {
    id: string;
    email: string;
}

export const createToken = (payload: PayloadType, expiresIn: number = 3600*24) => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: expiresIn},
    );
}

export const setTokenCookie = (token: string, res: express.Response, tokenName: string, expiresIn: number = 15 * 24 * 60 * 60 * 1000) => {
    res.cookie(tokenName, token, {
        maxAge: expiresIn,
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: !isDevelopment,
    });
}