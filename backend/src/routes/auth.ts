import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authMiddleware } from "../middleware/auth";
import { Request } from "express";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface authReq extends Request {
    user?: any;
}

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let errors: any = {};

        if (!name || name.trim().length === 0) errors.name = "Full Name is required";
        if (!email || !email.includes("@")) errors.email = "Please enter a valid email address";
        if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errors: { email: "This email is already registered" } });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Update Profile route
router.put("/profile", authMiddleware, async (req: authReq, res) => {
    try {
        const { name } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
