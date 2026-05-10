import express from 'express';
import { User } from '../models/user.ts';
import { OtpCode } from '../models/otpCode.ts';
import { sendMail } from '../helpers/mailer.ts';
import bcrypt from 'bcryptjs';
import { generatePin } from '../helpers/index.ts';
import { PasswordResetMail } from '../config/mails.ts';
import { fetchUserByEmail } from '../services/userServices.ts';
import { deleteOtpCodeByEmail, storeOtpCode } from '../services/otpCodeService.ts';

export const forgotPassword = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    const user = await fetchUserByEmail(email);

    if(!user) {
        return res.status(400).json({ message: 'User not found!' });
    }

    await deleteOtpCodeByEmail(user.email)

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
    const { email, otp, new_password } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if(!otp || !new_password || !email) {
        return res.status(400).json({ message: "Required fields are missing!" });
    }

    const otpCode = await OtpCode.findOne({ email, code: otp });

    if(!otpCode) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if(otpCode.expires_at < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }
    
    const hashedPassword = await bcrypt.hash(new_password, 12);
    user.password = hashedPassword;
    await user.save();

    await OtpCode.deleteMany({ email: user.email });

    let data = {
        status: "success",
        message: "Password reset successfully! Please login with your new password.",
    }

    return res.status(201).send(data);
}
