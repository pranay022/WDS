import { useEffect, useState } from "react";
import { getEndpoints, createEndpoint, deleteEndpoint } from "../services/api";
import { Globe, Key, FileText, Trash2, Plus, Server } from "lucide-react";

export default function Endpoints() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEndpoints = async () => {
    const data = await getEndpoints();
    setEndpoints(data);
  };

  useEffect(() => {
    loadEndpoints();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    await createEndpoint({
      url,
      secret,
      description
    });

    setUrl("");
    setSecret("");
    setDescription("");
    setLoading(false);
    loadEndpoints();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this endpoint?")) {
      await deleteEndpoint(id);
      loadEndpoints();
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Webhook Endpoints</h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage the destinations where your webhooks will be delivered.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem", alignItems: "start" }}>
        {/* Registration Form */}
        <div className="card" style={{ position: "sticky", top: "100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ padding: "0.5rem", borderRadius: "8px", background: "var(--accent-faint)", color: "var(--accent)" }}>
              <Plus size={20} />
            </div>
            <h2 style={{ fontSize: "1.25rem" }}>Register New Endpoint</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Target URL</label>
              <div style={{ position: "relative" }}>
                <Globe size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  placeholder="https://your-api.com/webhook"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Signing Secret</label>
              <div style={{ position: "relative" }}>
                <Key size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  placeholder="Shared secret for verification"
                  value={secret}
                  type="password"
                  onChange={(e) => setSecret(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Description</label>
              <div style={{ position: "relative" }}>
                <FileText size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  placeholder="e.g. Production Billing Notification"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: "0.5rem",
                padding: "0.8rem", 
                background: "var(--accent)", 
                color: "white", 
                borderRadius: "var(--radius-sm)", 
                fontWeight: 600,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Registering..." : <><Plus size={18} /> Register Endpoint</>}
            </button>
          </form>
        </div>

        {/* Endpoints List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Server size={20} color="var(--text-secondary)" />
            Active Endpoints ({endpoints.length})
          </h2>
          
          {endpoints.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <Globe size={40} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
              <p>No endpoints registered yet.</p>
            </div>
          ) : (
            endpoints.map((ep) => (
              <div key={ep.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem" }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "var(--bg-tertiary)", padding: "2px 6px", borderRadius: "4px", color: "var(--text-muted)" }}>ID: {ep.id}</span>
                    <h3 style={{ fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ep.url}</h3>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{ep.description || "No description provided"}</p>
                </div>
                <button 
                  onClick={() => handleDelete(ep.id)} 
                  style={{ 
                    padding: "0.6rem", 
                    borderRadius: "var(--radius-sm)", 
                    color: "var(--text-muted)", 
                    background: "transparent",
                    transition: "all 0.2s"
                  }}
                  className="delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .delete-btn:hover {
          color: var(--error) !important;
          background: var(--error-faint) !important;
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem 1rem 0.6rem 2.5rem",
  background: "var(--bg-primary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  outline: "none",
  fontSize: "0.875rem",
  transition: "border-color 0.2s ease"
};