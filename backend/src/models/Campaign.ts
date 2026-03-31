import { Schema, model, Document, Types } from "mongoose";

export interface ICampaign extends Document {
    name: string;
    description: string;
    influencers: Types.ObjectId[];
    clicks: number;
    startDate: Date;
    endDate: Date;
}

const CampaignSchema = new Schema<ICampaign>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        influencers: [{ type: Schema.Types.ObjectId, ref: "Influencer" }],
        clicks: { type: Number, default: 0 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    { timestamps: true }
);

export const Campaign = model<ICampaign>("Campaign", CampaignSchema);
