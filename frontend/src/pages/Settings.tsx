import { useState, useEffect } from "react";
import { Save, Bell, Shield, User, Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function Settings() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Initialize state with user data 
    useEffect(() => {
        if (user) {
            setName(user.name || "");
        }
    }, [user]);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSaved(false);
        try {
            const res = await api.put("/auth/profile", { name });
            updateUser(res.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <header className="app-header">
                <div className="header-title">
                    <h1>Settings</h1>
                    <p>Manage your account settings and preferences.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleSave()} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {loading ? <Loader2 size={18} className="animate-pulse" /> : saved ? <Check size={18} /> : <Save size={18} />}
                    {saved ? "Saved Data" : "Save Changes"}
                </button>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                <div className="glass-panel" style={{ padding: "1.5rem", height: "fit-content" }}>
                    <h3 style={{ marginBottom: "1rem" }}>Preferences</h3>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--rounded-md)", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--text-primary)" }}>
                            <User size={18} /> Profile
                        </li>
                        <li style={{ padding: "0.8rem", borderRadius: "var(--rounded-md)", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--text-secondary)", cursor: "pointer", transition: "var(--transition)" }} className="hover-nav">
                            <Bell size={18} /> Notifications
                        </li>
                        <li style={{ padding: "0.8rem", borderRadius: "var(--rounded-md)", display: "flex", alignItems: "center", gap: "0.8rem", color: "var(--text-secondary)", cursor: "pointer", transition: "var(--transition)" }} className="hover-nav">
                            <Shield size={18} /> Security
                        </li>
                    </ul>
                </div>

                <div className="glass-panel" style={{ padding: "2rem" }}>
                    <h2 style={{ marginBottom: "1.5rem" }}>Profile Information</h2>
                    <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} onSubmit={handleSave}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Email Address</label>
                            <input
                                type="email"
                                defaultValue={user?.email || ""}
                                className="input-field"
                                disabled
                                style={{ opacity: 0.7 }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Role</label>
                            <input
                                type="text"
                                defaultValue={user?.role === 'admin' ? "Administrator" : "Manager"}
                                className="input-field"
                                disabled
                                style={{ opacity: 0.7 }}
                            />
                        </div>

                        {/* Hidden submit trigger so enter key works in inputs natively */}
                        <button type="submit" style={{ display: 'none' }}>Submit</button>
                    </form>
                </div>
            </div>
            {/* Added simple hover style snippet for the nav */}
            <style>{`
                .hover-nav:hover {
                    background: rgba(255, 255, 255, 0.03);
                    color: var(--text-primary) !important;
                }
            `}</style>
        </div>
    );
}
