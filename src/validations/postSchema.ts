import z from "zod";

export const postDetailsSchema = z.object({
    caption: z.string().optional(),//.min(2, { message: "Caption must be at least 2 characters long" }),
    image: z.string().optional()//.min(2, { message: "Image must be at least 2 characters long" }),
}).refine((data) => data.caption || data.image, {
    message: "File and Caption can't be empty", path: ["caption"]
})


export const postCommentSchema = z.object({
    comment: z.string().min(2, { message: "Caption must be at least 2 characters long" }),
    // image: z.string().optional()//.min(2, { message: "Image must be at least 2 characters long" }),
})