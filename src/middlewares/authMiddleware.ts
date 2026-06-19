import express from "express";
import jwt from 'jsonwebtoken'
// import { AuthUserType, DataStoredInToken } from "../types/index.ts";
// import { User } from "../models/user.ts";
import { JWT_SECRET } from "../config/index.ts";

export interface DataStoredInToken {
  id: string;
  email: string;
}

const auth = async (req: any, res: express.Response, next: express.NextFunction)  => {
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Kindly login to access this resource' });
    }

    const token : string = authHeader.split(' ')[1] || '';

    try {
        
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        ) as DataStoredInToken;

        // req.user = await User.findById(decoded.id).select('-password');
        req.user = decoded;

        next();
    } catch (error) {
        // console.error("Token verification error: ", error || 'Server error');
        res.status(401).json({ message: "User Logged out" });
    }
}

export { auth };