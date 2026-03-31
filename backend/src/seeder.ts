import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./models/User";
import { Influencer } from "./models/Influencer";
import { Campaign } from "./models/Campaign";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/reachflow";

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        // Clear existing data
        await User.deleteMany({});
        await Influencer.deleteMany({});
        await Campaign.deleteMany({});
        console.log("Cleared existing collections...");

        // 1. Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        const user = await User.create({
            name: "Demo Admin",
            email: "demo@reachflow.com",
            password: hashedPassword,
            role: "admin"
        });
        console.log("Created demo user: demo@reachflow.com / password123");

        // 2. Create Influencers
        const influencers = [
            {
                name: "Sarah Jenkins",
                email: "contact@sarahcreates.com",
                platform: "Instagram",
                handle: "@sarahcreates",
                followers: 85400,
                niche: "Lifestyle",
                engagementRate: 4.2
            },
            {
                name: "David Tech",
                email: "biz@davidtech.com",
                platform: "YouTube",
                handle: "DavidTechReviews",
                followers: 125000,
                niche: "Tech & Gadgets",
                engagementRate: 5.8
            },
            {
                name: "Emily Fit",
                email: "collab@emilyfit.com",
                platform: "TikTok",
                handle: "@emily.fitness",
                followers: 240000,
                niche: "Fitness & Health",
                engagementRate: 7.1
            },
            {
                name: "Marcus Plays",
                email: "marcus@gaming.gg",
                platform: "YouTube",
                handle: "MarcusPlays",
                followers: 450000,
                niche: "Gaming",
                engagementRate: 3.5
            },
            {
                name: "Chloe Designs",
                email: "hello@chloedesigns.com",
                platform: "Instagram",
                handle: "@chloe.ui",
                followers: 42000,
                niche: "Design & Art",
                engagementRate: 6.2
            },
            {
                name: "Chef Mario",
                email: "mario@kitchentime.tv",
                platform: "YouTube",
                handle: "ChefMario",
                followers: 195000,
                niche: "Food & Cooking",
                engagementRate: 4.9
            }
        ];

        const insertedInfluencers = await Influencer.insertMany(influencers);
        console.log(`Created ${insertedInfluencers.length} influencers...`);

        // 3. Create Campaigns
        const campaigns = [
            {
                name: "Spring Gadget Review",
                status: "active",
                influencers: [insertedInfluencers[1]._id, insertedInfluencers[3]._id], // Tech & Gaming
                clicks: 1450,
                userId: user._id
            },
            {
                name: "Summer Fitness Apparel",
                status: "completed",
                influencers: [insertedInfluencers[0]._id, insertedInfluencers[2]._id], // Lifestyle & Fitness
                clicks: 3240,
                userId: user._id
            },
            {
                name: "Design Masterclass Promo",
                status: "draft",
                influencers: [insertedInfluencers[4]._id], // Design
                clicks: 25,
                userId: user._id
            },
            {
                name: "Kitchen Gadget Launch",
                status: "active",
                influencers: [insertedInfluencers[5]._id, insertedInfluencers[1]._id], // Food & Tech
                clicks: 890,
                userId: user._id
            }
        ];

        await Campaign.insertMany(campaigns);
        console.log(`Created ${campaigns.length} campaigns...`);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
