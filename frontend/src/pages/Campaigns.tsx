import { useState, useEffect } from "react";
import { api } from "../api";
import { Mail, Send, CheckCircle2, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "", startDate: "", endDate: "", influencers: [] as string[] });

    const [activeCampaign, setActiveCampaign] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [emailTemplate, setEmailTemplate] = useState({ subjectTemplate: "Partnership Opportunity: {InfluencerName} x ReachFlow", bodyTemplate: "Hi {InfluencerName},\n\nWe love your content! We're reaching out to discuss a potential partnership..." });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [campRes, infRes] = await Promise.all([
                api.get("/campaigns"),
                api.get("/influencers")
            ]);
            setCampaigns(campRes.data);
            setInfluencers(infRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async (e: any) => {
        e.preventDefault();
        try {
            await api.post("/campaigns", formData);
            setShowModal(false);
            setFormData({ name: "", description: "", startDate: "", endDate: "", influencers: [] });
            await fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCampaign = async () => {
        if (!confirmDeleteId) return;
        setDeletingId(confirmDeleteId);
        try {
            await api.delete(`/campaigns/${confirmDeleteId}`);
            await fetchData();
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete campaign.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleSendEmails = async () => {
        if (!activeCampaign) return;
        try {
            const res = await api.post(`/campaigns/${activeCampaign._id}/send-emails`, emailTemplate);
            alert(res.data.message);
            setActiveCampaign(null);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to send emails.");
        }
    };

    return (
        <div className="fade-in">
            <header className="app-header">
                <div className="header-title">
                    <h1>Campaigns</h1>
                    <p>Create outreach campaigns and monitor email sequences.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Mail size={18} /> New Campaign
                </button>
            </header>

            {loading ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                    <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 1rem" }} />
                    <p>Loading campaigns...</p>
                </div>
            ) : (
                <div className="metrics-grid">
                    {campaigns.map(camp => (
                        <div key={camp._id} className="metric-card glass-panel" style={{ cursor: "pointer" }} onClick={() => setActiveCampaign(camp)}>
                            <div className="metric-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    {camp.name}
                                    <CheckCircle2 color="var(--status-positive)" size={16} />
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(camp._id); }}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: "0.2rem", transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "1rem 0", height: "3rem", overflow: "hidden" }}>{camp.description}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{camp.influencers.length} Targets</span>
                                <button
                                    className="btn btn-secondary"
                                    style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
                                    onClick={(e) => { e.stopPropagation(); setActiveCampaign(camp); }}
                                >
                                    Send Sequence
                                </button>
                            </div>
                        </div>
                    ))}
                    {campaigns.length === 0 && (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed var(--border-color)" }}>
                            <p style={{ color: "var(--text-muted)" }}>No campaigns created yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="modal-overlay" style={{ zIndex: 110 }}>
                    <div className="glass-panel modal-content" style={{ maxWidth: "360px", textAlign: "center", padding: "2.5rem" }}>
                        <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                            <AlertTriangle size={32} />
                        </div>
                        <h2 style={{ marginBottom: "0.5rem" }}>Delete Campaign</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "2rem" }}>
                            Are you sure you want to delete this campaign? Tracking links will stop working.
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDeleteId(null)} disabled={!!deletingId}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1, background: "#ef4444" }} onClick={handleDeleteCampaign} disabled={!!deletingId}>
                                {deletingId ? <Loader2 className="animate-spin" size={18} /> : "Delete Campaign"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ maxWidth: "480px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2>Create Campaign</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCampaign} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input required type="text" placeholder="Campaign Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" />
                            <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3}></textarea>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="input-field" style={{ flex: 1 }} />
                                <input required type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="input-field" style={{ flex: 1 }} />
                            </div>

                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem" }}>Select Influencers</p>
                            <select multiple value={formData.influencers} onChange={e => setFormData({ ...formData, influencers: Array.from(e.target.selectedOptions, option => option.value) })} className="input-field" style={{ height: "120px" }}>
                                {influencers.map(inf => <option key={inf._id} value={inf._id} style={{ color: "black" }}>{inf.name} (@{inf.handle})</option>)}
                            </select>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Campaign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeCampaign && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ maxWidth: "540px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                            <h2>Send Sequence</h2>
                            <button onClick={() => setActiveCampaign(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{activeCampaign.name} - to {activeCampaign.influencers.length} influencers</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <input type="text" value={emailTemplate.subjectTemplate} onChange={e => setEmailTemplate({ ...emailTemplate, subjectTemplate: e.target.value })} className="input-field" />
                            <textarea value={emailTemplate.bodyTemplate} onChange={e => setEmailTemplate({ ...emailTemplate, bodyTemplate: e.target.value })} className="input-field" rows={6}></textarea>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Use {'{InfluencerName}'} to dynamically insert their name.</p>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setActiveCampaign(null)}>Cancel</button>
                                <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={handleSendEmails}><Send size={16} /> Send Emails</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
