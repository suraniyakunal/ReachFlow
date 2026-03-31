import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { Loader2 } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [globalError, setGlobalError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGlobalError("");
        setFieldErrors({});

        try {
            await api.post("/auth/register", { name, email, password });
            navigate("/login");
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setFieldErrors(err.response.data.errors);
            } else {
                setGlobalError(err.response?.data?.error || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }} className="fade-in">
            <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "1.8rem", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ReachFlow</h2>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Create your account to start outreach</p>
                </div>

                {globalError && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--status-negative)", padding: "0.8rem", borderRadius: "var(--rounded-md)", textAlign: "center", fontSize: "0.9rem" }}>
                        {globalError}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }} noValidate>
                    <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                            }}
                            style={{ borderColor: fieldErrors.name ? "var(--status-negative)" : "" }}
                            className="input-field"
                            placeholder="John Doe"
                        />
                        {fieldErrors.name && <p style={{ color: "var(--status-negative)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{fieldErrors.name}</p>}
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                            }}
                            style={{ borderColor: fieldErrors.email ? "var(--status-negative)" : "" }}
                            className="input-field"
                            placeholder="admin@reachflow.com"
                        />
                        {fieldErrors.email && <p style={{ color: "var(--status-negative)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{fieldErrors.email}</p>}
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.4rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                            }}
                            style={{ borderColor: fieldErrors.password ? "var(--status-negative)" : "" }}
                            className="input-field"
                            placeholder="••••••••"
                        />
                        {fieldErrors.password && <p style={{ color: "var(--status-negative)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{fieldErrors.password}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem", width: "100%", padding: "0.9rem" }} disabled={loading}>
                        {loading && <Loader2 className="animate-pulse" size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />}
                        <span style={{ verticalAlign: 'middle' }}>Sign Up</span>
                    </button>
                </form>

                <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Already have an account? <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: 500 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
