// Import the jsonwebtoken library
import jwt from "jsonwebtoken";
import { isDevelopment, JWT_SECRET } from "../config/index.ts";
import express from "express";
import * as cookie from 'cookie';


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

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as PayloadType;
}

export const setTokenCookie = (token: string, res: express.Response, tokenName: string, expiresIn: number = 15 * 24 * 60 * 60 * 1000) => {
    res.cookie(tokenName, token, {
        maxAge: expiresIn,
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: !isDevelopment,
    });

    res.setHeader(
        "Set-Cookie",
        cookie.stringifySetCookie({
            name: tokenName,
            value: token,
            httpOnly: true,
            maxAge: expiresIn,
            sameSite: "strict"

            // maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
        }),
    );
}

export const clearTokenCookie = (res: express.Response, tokenName: string) => {
    res.clearCookie(tokenName, { path: "/api/auth/logout" });
}