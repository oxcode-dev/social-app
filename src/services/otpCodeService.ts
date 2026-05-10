// import type { OtpCodeType } from "../types/index.ts";

import { type IOtpCode, OtpCode } from "../models/otpCode.ts";

export const fetchOtpCodeByEmail = async (email: string) => {
    return await OtpCode.findOne({ email });
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