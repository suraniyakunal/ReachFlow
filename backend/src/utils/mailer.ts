import nodemailer from "nodemailer";

// In a real application, you would configure this with SendGrid, Mailgun, or authentic SMTP
// We will use Ethereal for testing or simply log if credentials aren't provided.
export const sendEmail = async (to: string, subject: string, html: string) => {
    // Mock sending if no real credentials
    const user = process.env.EMAIL_USER || "test_user";
    const pass = process.env.EMAIL_PASS || "test_pass";

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: user,
            pass: pass,
        },
    });

    try {
        // We mock success if it's the test configuration since we don't have real ethereal credentials offhand
        if (user === "test_user") {
            console.log(`[MOCK EMAIL] Sent to ${to} | Subject: ${subject}`);
            return { messageId: `mock-${Date.now()}` };
        }

        const info = await transporter.sendMail({
            from: '"ReachFlow CRM" <outreach@reachflow.com>',
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
