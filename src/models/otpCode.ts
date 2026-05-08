import mongoose, { Schema } from "mongoose";


export interface IOtpCode {
  _id: string;
  email: string;
  code: string;
  expires_at: Date;
}

const otpCodeSchema = new Schema<IOtpCode>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        length: 4,
    },
    expires_at: {
        type: Date,
        required: true,
    },
}, {timestamps: true});

otpCodeSchema.set('toObject', { virtuals: true });
otpCodeSchema.set('toJSON', { virtuals: true });

export const OtpCode = mongoose.model('social_OtpCode', otpCodeSchema);