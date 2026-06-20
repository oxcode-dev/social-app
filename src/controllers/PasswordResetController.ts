import express from 'express';
import bcrypt from 'bcryptjs';
import { generatePin } from '../helpers/index.ts';
import { PasswordResetMail } from '../config/mails.ts';
import { fetchUserByEmail, updateUserPassword } from '../services/userServices.ts';
import { deleteOtpCodeByEmail, fetchOtpCodeByEmailAndOtp, storeOtpCode } from '../services/otpCodeService.ts';

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    const user = await fetchUserByEmail(email);

    if(!user) {
        return res.status(400).json({ message: 'User not found!' });
    }

    await deleteOtpCodeByEmail(user.email);

    const newOtpCodeDetails = {
        code: generatePin(4),
        email: user.email,
        expires_at: new Date(Date.now() + 15 * 60 * 1000) // OTP expires in 15 minutes
    }

    const otpCode = await storeOtpCode(newOtpCodeDetails);

    await PasswordResetMail(user.email, otpCode.code);

    let data = {
        status: "success",
        message: "Password reset OTP sent successfully! Please check your email.",
    }

    return res.status(201).send(data);
}

export const resetPassword = async (req: express.Request, res: express.Response) => {
    const { email, otp, new_password } = req.body as { email: string, otp: number, new_password: string };

    const user = await fetchUserByEmail(email);

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const otpCode = await fetchOtpCodeByEmailAndOtp(email, otp);

    if(!otpCode) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if(otpCode.expires_at < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }
    
    const hashedPassword = await bcrypt.hash(new_password, 12);

    await updateUserPassword(user._id, { password: hashedPassword })

    await deleteOtpCodeByEmail(user.email);

    let data = {
        status: "success",
        message: "Password reset successfully! Please login with your new password.",
    }

    return res.status(200).send(data);
}
