import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "manager" | "viewer";
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "manager", "viewer"], default: "manager" },
    },
    { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
