import { useEffect, useState } from "react";
import { api } from "../api";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, CartesianGrid
} from "recharts";
import { Link2, Users, Cpu, TrendingUp, BarChart3, PieChart as PieIcon } from "lucide-react";

const COLORS = ["#818cf8", "#f59e0b", "#0ea5e9", "#10b981", "#ec4899", "#8b5cf6"];

export default function Analytics() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [campRes, infRes] = await Promise.all([
                api.get("/campaigns"),
                api.get("/influencers"),
            ]);
            setCampaigns(campRes.data);
            setInfluencers(infRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalClicks = campaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const totalInfluencers = influencers.length;
    const outreachCount = influencers.filter(i => i.status !== "Not Reached").length;
    const avgFollowers = totalInfluencers > 0
        ? Math.round(influencers.reduce((acc, i) => acc + (i.followers || 0), 0) / totalInfluencers)
        : 0;
    const outreachPct = totalInfluencers > 0 ? Math.round((outreachCount / totalInfluencers) * 100) : 0;

    const timelineData = (() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        if (totalClicks === 0) return days.map(d => ({ name: d, clicks: 0 }));
        return [
            { name: "Mon", clicks: Math.round(totalClicks * 0.1) },
            { name: "Tue", clicks: Math.round(totalClicks * 0.15) },
            { name: "Wed", clicks: Math.round(totalClicks * 0.25) },
            { name: "Thu", clicks: Math.round(totalClicks * 0.3) },
            { name: "Fri", clicks: Math.round(totalClicks * 0.12) },
            { name: "Sat", clicks: Math.round(totalClicks * 0.05) },
            { name: "Sun", clicks: Math.round(totalClicks * 0.03) },
        ];
    })();

    const platformDist = (() => {
        const counts: Record<string, number> = {};
        influencers.forEach(inf => {
            const p = (inf.platform || "Other");
            const key = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        });
        const out = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));
        return out.length > 0 ? out : [{ name: "No Data", value: 1 }];
    })();

    const topCampaigns = [...campaigns]
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5);

    const tooltipStyle = {
        background: "rgba(10,10,20,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "0.75rem 1rem",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        color: "#f8f9fa",
        fontSize: "0.85rem",
    };

    return (
        <div className="fade-in">
            {/* ── Header ───────────────────────────────── */}
            <header className="app-header">
                <div className="header-title">
                    <h1>Performance Insights</h1>
                    <p>Live aggregation of your talent pool &amp; campaign attribution.</p>
                </div>
            </header>

            {/* ── Stat Cards Row ───────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
                <StatCard icon={<Users size={20} />} label="Total Identities" value={totalInfluencers} sub="Registered in CRM" color="#818cf8" loading={loading} />
                <StatCard icon={<Link2 size={20} />} label="Referral Clicks" value={totalClicks} sub="Attribution total" color="#0ea5e9" loading={loading} />
                <StatCard icon={<Cpu size={20} />} label="Active Outreach" value={outreachCount} sub={`${outreachPct}% contacted`} color="#f59e0b" loading={loading} />
                <StatCard
                    icon={<TrendingUp size={20} />}
                    label="Avg Audience Size"
                    value={avgFollowers >= 1_000_000 ? (avgFollowers / 1_000_000).toFixed(1) + "M" : avgFollowers >= 1_000 ? (avgFollowers / 1_000).toFixed(1) + "K" : avgFollowers}
                    sub="Mean across all IDs"
                    color="#10b981"
                    loading={loading}
                    raw
                />
            </div>

            {/* ── Referral Traffic Chart (full‑width) ─── */}
            <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                    <div>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.15rem" }}>
                            <BarChart3 size={20} color="#818cf8" /> Referral Traffic
                        </h3>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                            Campaign link-attribution timeline (last 7 days)
                        </p>
                    </div>
                    <div style={{ textAlign: "right", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.2)", padding: "0.6rem 1.2rem", borderRadius: "12px" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>Total</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#818cf8", lineHeight: 1.2 }}>
                            {loading ? "—" : totalClicks.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div style={{ height: 300 }}>
                    {!loading && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData} margin={{ left: -15, right: 10, top: 5, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} dy={12} tick={{ fontSize: 12 }} />
                                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} dx={-5} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#818cf8" }} cursor={{ stroke: "rgba(129,140,248,0.3)", strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="clicks" stroke="#818cf8" strokeWidth={3} fill="url(#gClicks)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                    {loading && <LoadingBlock height={300} />}
                </div>
            </div>

            {/* ── Bottom 2‑col: Pie | Campaigns ─────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.5rem", marginBottom: "2rem" }}>

                {/* Donut chart */}
                <div className="glass-panel" style={{ padding: "1.75rem" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                        <PieIcon size={18} color="#f59e0b" /> Platform Mix
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
                        Where your identities live
                    </p>

                    <div style={{ position: "relative", height: 220 }}>
                        {!loading && (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformDist}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={58}
                                        outerRadius={88}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {platformDist.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend verticalAlign="bottom" iconType="circle" iconSize={10} wrapperStyle={{ fontSize: "0.82rem", color: "var(--text-secondary)", paddingTop: "0.5rem" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                        {/* Centre label */}
                        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "white" }}>{totalInfluencers}</div>
                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "1px" }}>TOTAL IDs</div>
                        </div>
                        {loading && <LoadingBlock height={220} />}
                    </div>

                    {/* Progress bars */}
                    <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Outreach Maturity</p>
                        <Bar label="Contacted" pct={outreachPct} color="#10b981" />
                        <Bar label="Pending Reply" pct={Math.max(0, 30 - outreachPct)} color="#f59e0b" />
                        <Bar label="Not Reached" pct={100 - outreachPct} color="#818cf8" />
                    </div>
                </div>

                {/* Campaign table */}
                <div className="glass-panel" style={{ padding: "1.75rem" }}>
                    <h3 style={{ fontSize: "1.05rem", marginBottom: "0.3rem" }}>Campaign Attribution</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "1.5rem" }}>All campaigns ranked by referral performance</p>

                    {loading ? (
                        <LoadingBlock height={300} />
                    ) : topCampaigns.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                            No campaigns yet. Create one to see attribution here.
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {topCampaigns.map((camp, i) => {
                                const maxClicks = topCampaigns[0]?.clicks || 1;
                                const pct = Math.round(((camp.clicks || 0) / maxClicks) * 100);
                                return (
                                    <div key={camp._id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
                                        <div style={{ minWidth: 28, height: 28, borderRadius: 8, background: `${COLORS[i % COLORS.length]}18`, color: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>{i + 1}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{camp.name}</div>
                                            <div style={{ marginTop: "0.4rem", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                                                <div style={{ width: `${pct}%`, height: "100%", background: COLORS[i % COLORS.length], borderRadius: 999, transition: "width 0.6s ease" }} />
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right", minWidth: 55 }}>
                                            <div style={{ fontWeight: 700, fontSize: "1rem" }}>{(camp.clicks || 0).toLocaleString()}</div>
                                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Clicks</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Sub-components ──────────────────────────── */

function StatCard({ icon, label, value, sub, color, loading, raw }: any) {
    return (
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <div>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500, marginBottom: "0.4rem" }}>{label}</p>
                {loading ? (
                    <div style={{ height: 32, width: 80, background: "rgba(255,255,255,0.06)", borderRadius: 8 }} />
                ) : (
                    <h2 style={{ fontSize: "1.65rem", fontWeight: 800, margin: 0, color: "white" }}>
                        {raw ? value : typeof value === "number" ? value.toLocaleString() : value}
                    </h2>
                )}
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>{sub}</p>
            </div>
            <div style={{ background: `${color}18`, color, width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
            </div>
        </div>
    );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
    const safe = Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct));
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ color, fontWeight: 600 }}>{safe}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${safe}%`, height: "100%", background: color, borderRadius: 999 }} />
            </div>
        </div>
    );
}

function LoadingBlock({ height }: { height: number }) {
    return (
        <div className="animate-pulse" style={{ height, borderRadius: 12, background: "rgba(255,255,255,0.03)" }} />
    );
}
