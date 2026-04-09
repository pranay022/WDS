import { Shield, RefreshCcw, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ width: "100%" }}>
      {/* Hero Section */}
      <section style={{ 
        padding: "6rem 2rem", 
        textAlign: "center", 
        background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "4rem", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.04em" }}>
            Reliable Webhook <br />
            <span style={{ color: "var(--accent)" }}>Delivery Service</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            The infrastructure you need to send, track, and manage webhooks at scale. 
            Built for reliability with built-in retries and real-time observability.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link to="/endpoints" style={{ 
              padding: "0.8rem 2rem", 
              background: "var(--accent)", 
              color: "white", 
              borderRadius: "var(--radius-sm)", 
              fontWeight: 600 
            }}>
              Manage Endpoints
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Everything you need</h2>
          <p style={{ color: "var(--text-secondary)" }}>WDS provides the core primitives for any webhook integration.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: Shield, title: "Secure Delivery", desc: "Endpoints are validated and delivery is tracked with full audit logs." },
            { icon: RefreshCcw, title: "Retry Strategies", desc: "Customizable backoff logic for failed delivery attempts." },
            { icon: Search, title: "Full Observability", desc: "Search through logs by event ID, endpoint, or status code." }
          ].map((feat, i) => (
            <div key={i} className="card">
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--accent-faint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <feat.icon size={24} />
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{feat.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", borderTop: "1px solid var(--border)" }}>
        <p>© 2026 Webhook Delivery Service. All rights reserved.</p>
      </footer>
    </div>
  );
}
