import { Link, useLocation } from "react-router-dom";
import { Home, Globe, Zap, Activity } from "lucide-react";

export default function Navbar() {
    const location = useLocation();
    
    const navItems = [
        { path: "/", label: "Home", icon: Home },
        { path: "/dashboard", label: "Dashboard", icon: Activity },
        { path: "/endpoints", label: "Endpoints", icon: Globe },
        { path: "/events", label: "Events", icon: Zap },
    ];

    return (
        <nav className="glass" style={{ 
            position: "sticky", 
            top: 0, 
            zIndex: 100, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "0.75rem 2rem",
            borderBottom: "1px solid var(--border)"
        }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", color: "inherit" }}>
                <div style={{ 
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px", 
                    overflow: "hidden",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    objectFit: "cover"
                }}>
                    <img src="/logo.png" alt="WDS Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>WDS</h2>
            </Link>

            <div style={{ display: "flex", gap: "1rem" }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "var(--radius-sm)",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                background: isActive ? "var(--accent-faint)" : "transparent",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
