import { Router } from "express";
import { Campaign } from "../models/Campaign";
import { Influencer } from "../models/Influencer";
import { sendEmail } from "../utils/mailer";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate("influencers");
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ error: "Error fetching campaigns" });
    }
});

router.post("/", async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (err) {
        res.status(500).json({ error: "Error creating campaign" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(campaign);
    } catch (err) {
        res.status(500).json({ error: "Error updating campaign" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        res.json({ message: "Campaign deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting campaign" });
    }
});

// Route to track clicks on custom links
router.get("/:id/track/:influencerId", async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) return res.status(404).send("Link expired or invalid");

        // Increment global campaign clicks
        campaign.clicks += 1;
        await campaign.save();

        // Redirect to a destination. In a real scenario, this would be a configured URL on the Campaign model.
        res.redirect("https://www.example.com/sponsor-landing");
    } catch (err) {
        res.status(500).send("Error processing tracking link");
    }
});

// Route to trigger sending automated emails
router.post("/:id/send-emails", async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate("influencers");
        if (!campaign) return res.status(404).json({ error: "Campaign not found" });

        const { subjectTemplate, bodyTemplate } = req.body;
        if (!subjectTemplate || !bodyTemplate) {
            return res.status(400).json({ error: "Email templates missing" });
        }

        let sentCount = 0;
        for (const inf of campaign.influencers as any) {
            if (inf.email) {
                // Replace variable tags and append tracking link
                const trackingLink = `http://localhost:5000/api/campaigns/${campaign._id}/track/${inf._id}`;

                const pSubject = subjectTemplate.replace(/{InfluencerName}/g, inf.name);
                let pBody = bodyTemplate.replace(/{InfluencerName}/g, inf.name);

                // Automatically append tracking link for them if not injected
                pBody += `\n\nTracking Link: ${trackingLink}`;

                await sendEmail(inf.email, pSubject, pBody);

                // Update status for tracking
                await Influencer.findByIdAndUpdate(inf._id, { status: "Contacted" });
                sentCount++;
            }
        }

        res.json({ message: `Emails sent successfully to ${sentCount} influencers.` });
    } catch (err) {
        console.error("Error process emails:", err);
        res.status(500).json({ error: "Error processing emails" });
    }
});

export default router;
