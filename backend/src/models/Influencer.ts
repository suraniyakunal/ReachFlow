import { Schema, model, Document } from "mongoose";

export interface IInfluencer extends Document {
    name: string;
    handle: string;
    platform: "instagram" | "youtube" | "tiktok";
    followers: number;
    niche: string;
    email?: string;
    status: "Contacted" | "Negotiating" | "Content Live" | "Not Reached";
    engagementRate?: number;
}

const InfluencerSchema = new Schema<IInfluencer>(
    {
        name: { type: String, required: true },
        handle: { type: String, required: true },
        platform: { type: String, enum: ["instagram", "youtube", "tiktok"], required: true },
        followers: { type: Number, required: true },
        niche: { type: String, required: true },
        email: { type: String },
        status: {
            type: String,
            enum: ["Contacted", "Negotiating", "Content Live", "Not Reached"],
            default: "Not Reached",
        },
        engagementRate: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Influencer = model<IInfluencer>("Influencer", InfluencerSchema);
