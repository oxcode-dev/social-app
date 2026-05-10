import express from 'express';
import bcrypt from 'bcryptjs';
import { fetchUserByEmail, fetchUserById, storeUser } from '../services/userServices.ts';
import { clearTokenCookie, createToken, setTokenCookie, verifyToken } from '../utils/jwt.ts';

const MONTH = 30 * 24 * 60 * 60; // in seconds

export const userRegistration = async (req: express.Request, res: express.Response) => {

    const { email, password, first_name, last_name, username } = req.body;

    const userExists = await fetchUserByEmail(email);

    if(userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const savedUser = await storeUser({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        username,
    });

    const payload = { 
        id: savedUser._id,
        email: savedUser.email,
    }

    const token = createToken(payload);
    const refresh_token = createToken(payload, MONTH);

    setTokenCookie(refresh_token, res, 'refreshtoken', MONTH);

    return res.status(201).json({
        token, 
        message: 'User registered successfully', 
        user: { 
            id: savedUser._id,
            email: savedUser.email,
            first_name: savedUser.first_name,
            last_name: savedUser.last_name,
            username: savedUser.username,
            avatar: savedUser.avatar,
            bio: savedUser.bio,
        }
    });
}

export const userLogin = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    const user = await fetchUserByEmail(email);

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user?.password)

    if(!user || !isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { 
        id: user._id,
        email: user.email,
    }

    const token = createToken(payload);
    const refresh_token = createToken(payload, MONTH);

    setTokenCookie(refresh_token, res, 'refreshtoken', MONTH);
    
    return res.status(201).json({
        token,
        user: {
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
        },
        message: 'Login successful'
    });
}

export const userLogout = async (req: express.Request, res: express.Response) => {
    
    setTokenCookie('', res, 'refreshtoken', 0);
    clearTokenCookie(res, 'refreshtoken');

    // Sending success response
    res.status(201).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: express.Request, res: express.Response) => {
    const refresh_token = req.cookies['refreshtoken']
    console.log("Received refresh token: ", refresh_token);
    
    if (!refresh_token) {
        return res.status(400).json({ msg: "Please login again." });
    }

    // const result = jwt.verify(refresh_token, JWT_SECRET) as PayloadType;
    const result = verifyToken(refresh_token)

    const user = await fetchUserById(result?.id);

    if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
    }

    const payload = { 
        id: user?.id,
        email: user?.email,
    }

    const access_token = createToken(payload);

    res.json({ access_token });

}
