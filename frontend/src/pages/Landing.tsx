import { Link } from "react-router-dom";
import { Flame, Users, MailCheck, BarChart3, CheckCircle2 } from "lucide-react";

export default function Landing() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="fade-in">

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 4rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.2rem", color: "white" }}>
                    <div style={{ background: "var(--accent-gradient)", padding: "0.4rem", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Flame size={20} color="white" />
                    </div>
                    ReachFlow
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Link to="/login" className="btn btn-secondary">Sign In</Link>
                    <Link to="/register" className="btn btn-primary">Start Free Trial</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ textAlign: "center", padding: "6rem 2rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "inline-block", padding: "0.4rem 1rem", background: "rgba(99, 102, 241, 0.1)", color: "var(--accent-primary)", borderRadius: "var(--rounded-full)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                    ✨ ReachFlow 1.0 is now live
                </div>
                <h1 style={{ fontSize: "3.5rem", lineHeight: 1.2, margin: "0 0 1.5rem 0", color: "white" }}>
                    The complete CRM for <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Micro-Influencers</span>
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
                    Discover, track, and manage relationships with YouTube and Instagram creators seamlessly. Automate your outreach and analyze real-time campaign conversions.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem" }}>Get Started for Free</Link>
                    <Link to="/login" className="btn btn-secondary" style={{ padding: "0.8rem 2rem", fontSize: "1.1rem" }}>View Demo</Link>
                </div>
            </section>

            {/* Services / Features Section */}
            <section style={{ padding: "4rem 2rem", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "2rem", color: "white", marginBottom: "0.5rem" }}>Services Provided in the Pro Plan</h2>
                        <p style={{ color: "var(--text-secondary)" }}>Everything you need to launch high-converting influencer campaigns.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                        <div className="glass-panel" style={{ padding: "2rem" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                                <Users size={24} color="var(--accent-primary)" />
                            </div>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Influencer Management</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                                Centralized database to store, tag, and categorize creators based on their niche and follower thresholds. Real-time stats are hooked up via Graph APIs.
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: "2rem" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                                <MailCheck size={24} color="var(--status-purple, #a855f7)" />
                            </div>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Automated Sequences</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                                Craft personalized, variable-tagged email configurations. ReachFlow executes fully threaded outreach natively, saving hours of manual email drafting.
                            </p>
                        </div>

                        <div className="glass-panel" style={{ padding: "2rem" }}>
                            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                                <BarChart3 size={24} color="var(--status-positive)" />
                            </div>
                            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Real-Time Tracking</h3>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                                Generate custom proxy tracking links automatically. Our powerful Dashboard visualizes traffic KPIs, engagement rates, and accurate conversions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Demo */}
            <section style={{ padding: "4rem 2rem", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
                <h2 style={{ fontSize: "2rem", color: "white", marginBottom: "2rem" }}>Transparent Pricing</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
                    {/* Basic */}
                    <div className="glass-panel" style={{ padding: "2.5rem" }}>
                        <h3 style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Starter</h3>
                        <div style={{ fontSize: "3rem", fontWeight: 700, color: "white", margin: "1rem 0" }}>$0<span style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 400 }}>/mo</span></div>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", margin: "2rem 0" }}>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-secondary)" }}><CheckCircle2 size={20} color="var(--text-muted)" /> Up to 50 Influencers</li>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-secondary)" }}><CheckCircle2 size={20} color="var(--text-muted)" /> Manual Email Templates</li>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-secondary)" }}><CheckCircle2 size={20} color="var(--text-muted)" /> Basic Analytics</li>
                        </ul>
                        <Link to="/register" className="btn btn-secondary" style={{ width: "100%", padding: "0.8rem", textAlign: "center", display: "block" }}>Start Free</Link>
                    </div>

                    {/* Pro */}
                    <div className="glass-panel" style={{ padding: "2.5rem", border: "1px solid var(--accent-primary)", position: "relative" }}>
                        <div style={{ position: "absolute", top: "-12px", right: "2rem", background: "var(--accent-gradient)", color: "white", padding: "0.2rem 1rem", borderRadius: "10px", fontSize: "0.8rem", fontWeight: 600 }}>POPULAR</div>
                        <h3 style={{ fontSize: "1.2rem", color: "var(--accent-primary)" }}>Pro Plan</h3>
                        <div style={{ fontSize: "3rem", fontWeight: 700, color: "white", margin: "1rem 0" }}>$49<span style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 400 }}>/mo</span></div>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", margin: "2rem 0" }}>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-primary)" }}><CheckCircle2 size={20} color="var(--accent-primary)" /> Unlimited Influencers</li>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-primary)" }}><CheckCircle2 size={20} color="var(--accent-primary)" /> Automated Email Sequences</li>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-primary)" }}><CheckCircle2 size={20} color="var(--accent-primary)" /> Custom Link Tracking</li>
                            <li style={{ display: "flex", gap: "0.5rem", color: "var(--text-primary)" }}><CheckCircle2 size={20} color="var(--accent-primary)" /> External API Fetching</li>
                        </ul>
                        <Link to="/register" className="btn btn-primary" style={{ width: "100%", padding: "0.8rem", textAlign: "center", display: "block" }}>Start Pro Trial</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
