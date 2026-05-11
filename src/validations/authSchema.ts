import z from "zod";

export const registerSchema = z.object({
    first_name: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters long" }),
    // phoneno: z.string().regex(/^\d{10,15}$/, "Invalid phone number").min(10).max(15),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
    username: z.string().min(2, { message: "Username must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})

export const loginSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})

export const resetPasswordSchema = z.object({
    otp: z.number()
        .min(4, { message: "OTP code must be at least 4 characters long" }),
    new_password: z.string().min(6, { message: "Password must be at least 6 characters long" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    email: z.string().email({ message: "Invalid email address" }).trim().toLowerCase(),
})