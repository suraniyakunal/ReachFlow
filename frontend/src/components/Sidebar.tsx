import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Mail, BarChart3, Settings, Flame, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Influencers", path: "/influencers", icon: <Users size={20} /> },
        { name: "Campaigns", path: "/campaigns", icon: <Mail size={20} /> },
        { name: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="logo-icon">
                    <Flame size={20} />
                </div>
                <span>ReachFlow</span>
            </div>

            <nav className="nav-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: "auto" }}>
                <div className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--rounded-md)", textAlign: "center" }}>
                    <p style={{ fontSize: "0.85rem", color: "white", fontWeight: 600, marginBottom: "0.2rem" }}>{user?.name || "User"}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>{user?.role === 'admin' ? "Administrator" : "Manager"}</p>
                    <button className="btn btn-secondary" onClick={logout} style={{ width: "100%", fontSize: "0.8rem", padding: "0.5rem", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
