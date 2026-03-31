import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { Loader2 } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }} className="fade-in">
            <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.8rem", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ReachFlow</h2>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Sign in to manage your campaigns</p>
                </div>

                {error && <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--status-negative)", padding: "0.8rem", borderRadius: "var(--rounded-md)", textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="admin@reachflow.com" />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", width: "100%", padding: "0.9rem" }} disabled={loading}>
                        {loading ? <Loader2 className="animate-pulse" size={18} /> : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Don't have an account? <Link to="/register" style={{ color: "var(--accent-primary)", fontWeight: 500 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
