import { sendMail } from "../helpers/mailer.ts";
import { CLIENT_URL, EMAIL_SMTP_USERNAME } from "./index.ts";

export const PasswordResetMail = async (email: string, otpCode: number) => {
    return await sendMail(
        EMAIL_SMTP_USERNAME,
        email,
        // 'mrexcelsam1@gmail.com',
        "Password Reset OTP",
        `<p>Your account with email ${email} has been requested for password reset.</p>
        <p>Your OTP is: <b>${otpCode}</b></p>
        <p>Thank you for using our application!</p>
        <p><a href="${CLIENT_URL}/reset-password">Click here to reset your password</a></p>`
    );
}