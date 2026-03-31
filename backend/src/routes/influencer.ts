import { Router } from "express";
import { Influencer } from "../models/Influencer";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const influencers = await Influencer.find();
        res.json(influencers);
    } catch (err) {
        res.status(500).json({ error: "Error fetching influencers" });
    }
});

router.post("/", async (req, res) => {
    try {
        const influencer = new Influencer(req.body);
        await influencer.save();
        res.status(201).json(influencer);
    } catch (err) {
        res.status(500).json({ error: "Error creating influencer" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const influencer = await Influencer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(influencer);
    } catch (err) {
        res.status(500).json({ error: "Error updating influencer" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Influencer.findByIdAndDelete(req.params.id);
        res.json({ message: "Influencer deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting influencer" });
    }
});

export default router;
