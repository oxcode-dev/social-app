// import type { OtpCodeType } from "../types/index.ts";

import { type IOtpCode, OtpCode } from "../models/otpCode.ts";

export const fetchOtpCodeByEmailAndOtp = async (email: string, otp: number) => {
    return await OtpCode.findOne({ email, code: otp } );
};

export const destroyOtpCode = async (): Promise<any> => {
    return await OtpCode.deleteMany();
}

export const deleteOtpCodeByEmail = async (email: string): Promise<any> => {
    return await OtpCode.deleteMany({ email: email });
}

export const storeOtpCode = async (data: Omit<IOtpCode, "_id">) => {
    return await OtpCode.create(data)
}