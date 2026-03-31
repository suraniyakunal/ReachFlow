import { useState, useEffect } from "react";
import { api } from "../api";
import { Plus, Search, Loader2, Trash2, X, AlertTriangle } from "lucide-react";

export default function Influencers() {
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", handle: "", platform: "instagram", niche: "", email: "" });
    const [fetchingStats, setFetchingStats] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchInfluencers();
    }, []);

    const fetchInfluencers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/influencers");
            setInfluencers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e: any) => {
        e.preventDefault();
        setFetchingStats(true);
        try {
            const statRes = await api.get(`/external/stats?handle=${formData.handle}&platform=${formData.platform}`);
            const { followers, engagementRate } = statRes.data;

            await api.post("/influencers", {
                ...formData,
                followers,
                engagementRate,
            });

            setShowModal(false);
            fetchInfluencers();
            setFormData({ name: "", handle: "", platform: "instagram", niche: "", email: "" });
        } catch (err) {
            console.error("Failed to add influencer", err);
        } finally {
            setFetchingStats(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDeleteId) return;
        setDeletingId(confirmDeleteId);
        try {
            await api.delete(`/influencers/${confirmDeleteId}`);
            await fetchInfluencers();
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete influencer.");
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes("contacted")) return <span className="badge badge-contacted">{status}</span>;
        if (s.includes("negotiating")) return <span className="badge badge-negotiating">{status}</span>;
        if (s.includes("live")) return <span className="badge badge-live">{status}</span>;
        return <span className="badge" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>{status}</span>;
    };

    return (
        <div className="fade-in">
            <header className="app-header">
                <div className="header-title">
                    <h1>Influencer CRM</h1>
                    <p>Manage your discovered talent and relationship status.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Add Influencer
                </button>
            </header>

            <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                        <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                        <input
                            type="text"
                            placeholder="Search by name or handle..."
                            style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.5rem", borderRadius: "var(--rounded-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", color: "white" }}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Influencer</th>
                                <th>Platform</th>
                                <th>Niche</th>
                                <th>Followers</th>
                                <th>Engagement</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ textAlign: "center" }}>Loading...</td></tr>
                            ) : influencers.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: "center" }}>No influencers added yet.</td></tr>
                            ) : (
                                influencers.map(inf => (
                                    <tr key={inf._id}>
                                        <td>
                                            <div className="influencer-profile">
                                                <div className="influencer-avatar" style={{ background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
                                                    {inf.name.charAt(0)}
                                                </div>
                                                <div className="influencer-info">
                                                    <h4>{inf.name}</h4>
                                                    <p>@{inf.handle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textTransform: "capitalize" }}>{inf.platform}</td>
                                        <td>{inf.niche}</td>
                                        <td>{inf.followers.toLocaleString()}</td>
                                        <td>{inf.engagementRate}%</td>
                                        <td>{getStatusBadge(inf.status)}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                onClick={() => setConfirmDeleteId(inf._id)}
                                                className="btn-icon"
                                                style={{ color: "#ef4444", padding: "0.5rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "none", cursor: "pointer", transition: "all 0.2s" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)")}
                                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="modal-overlay" style={{ zIndex: 110 }}>
                    <div className="glass-panel modal-content" style={{ maxWidth: "360px", textAlign: "center", padding: "2.5rem" }}>
                        <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 style={{ marginBottom: "0.5rem" }}>Delete Influencer</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
                            Are you sure? This action will permanently remove this influencer from your CRM.
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDeleteId(null)} disabled={!!deletingId}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={handleDelete} disabled={!!deletingId}>
                                {deletingId ? <Loader2 className="animate-spin" size={18} /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ width: "400px", padding: "2rem", animation: "slideUp 0.3s ease forwards" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2>Add Influencer</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
                            <input required type="text" placeholder="Handle (e.g. mkbhd)" value={formData.handle} onChange={e => setFormData({ ...formData, handle: e.target.value })} style={inputStyle} />
                            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} />
                            <select value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} style={inputStyle}>
                                <option value="instagram" style={{ color: "black" }}>Instagram</option>
                                <option value="youtube" style={{ color: "black" }}>YouTube</option>
                                <option value="tiktok" style={{ color: "black" }}>TikTok</option>
                            </select>
                            <input required type="text" placeholder="Niche (e.g. Tech)" value={formData.niche} onChange={e => setFormData({ ...formData, niche: e.target.value })} style={inputStyle} />

                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={fetchingStats}>
                                    {fetchingStats ? <Loader2 className="animate-spin" size={18} /> : "Save & Fetch Stats"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const inputStyle = { width: "100%", padding: "0.8rem 1rem", borderRadius: "var(--rounded-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", color: "white" };
