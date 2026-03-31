import { useEffect, useState } from "react";
import { Users, MailCheck, TrendingUp, MousePointerClick } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ influencers: 0, campaigns: 0, clicks: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [infRes, campRes] = await Promise.all([
                    api.get('/influencers'),
                    api.get('/campaigns')
                ]);
                const totalClicks = campRes.data.reduce((acc: any, c: any) => acc + (c.clicks || 0), 0);
                setStats({
                    influencers: infRes.data.length,
                    campaigns: campRes.data.length,
                    clicks: totalClicks
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard-container fade-in">
            <header className="app-header delay-1">
                <div className="header-title">
                    <h1>Overview</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate("/campaigns")}>+ New Campaign</button>
            </header>

            <div className="metrics-grid delay-2">
                <MetricCard title="Total Influencers" value={loading ? "..." : stats.influencers.toString()} icon={<Users />} color="blue" trend="+12%" />
                <MetricCard title="Active Campaigns" value={loading ? "..." : stats.campaigns.toString()} icon={<MailCheck />} color="purple" trend="+4" />
                <MetricCard title="Avg Engagement" value="4.8%" icon={<TrendingUp />} color="green" trend="+1.2%" />
                <MetricCard title="Link Clicks" value={loading ? "..." : stats.clicks.toLocaleString()} icon={<MousePointerClick />} color="orange" trend="+2%" />
            </div>

            <div className="dashboard-content delay-3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3>Recent Outreach</h3>
                        <button className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>View All</button>
                    </div>

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Influencer</th>
                                    <th>Platform</th>
                                    <th>Followers</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array(4).fill(0).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={4}><div className="animate-pulse" style={{ height: "40px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--rounded-md)" }}></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr>
                                            <td>
                                                <div className="influencer-profile">
                                                    <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="influencer-avatar" />
                                                    <div className="influencer-info">
                                                        <h4>Sarah Jenkins</h4>
                                                        <p>@sarahcreates</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Instagram</td>
                                            <td>85K</td>
                                            <td><span className="badge badge-contacted">Contacted</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="influencer-profile">
                                                    <img src="https://i.pravatar.cc/150?u=2" alt="Avatar" className="influencer-avatar" />
                                                    <div className="influencer-info">
                                                        <h4>David Tech</h4>
                                                        <p>David Tech Reviews</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>YouTube</td>
                                            <td>120K</td>
                                            <td><span className="badge badge-negotiating">Negotiating</span></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="influencer-profile">
                                                    <img src="https://i.pravatar.cc/150?u=3" alt="Avatar" className="influencer-avatar" />
                                                    <div className="influencer-info">
                                                        <h4>Emily Lifestyle</h4>
                                                        <p>@emily.styles</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>TikTok</td>
                                            <td>250K</td>
                                            <td><span className="badge badge-live">Content Live</span></td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <h3>Top Performing Niches</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Based on engagement rate</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        <NicheBar name="Tech & Gadgets" percent={85} color="var(--accent-primary)" />
                        <NicheBar name="Lifestyle & Fashion" percent={65} color="var(--status-warning)" />
                        <NicheBar name="Fitness & Health" percent={45} color="var(--status-positive)" />
                        <NicheBar name="Gaming" percent={30} color="var(--status-info)" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, color, trend }: any) {
    const isPositive = trend.includes("+");
    return (
        <div className="metric-card glass-panel">
            <div className="metric-header">
                {title}
                <div className={`metric-icon ${color}`}>{icon}</div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <div className="metric-value">{value}</div>
                <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
                    {trend}
                </div>
            </div>
        </div>
    );
}

function NicheBar({ name, percent, color }: any) {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                <span>{name}</span>
                <span style={{ fontWeight: 600 }}>{percent}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "var(--rounded-full)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percent}%`, background: color, borderRadius: "var(--rounded-full)" }}></div>
            </div>
        </div>
    );
}
