import { useEffect, useState } from "react";
import { getEndpoints, createEvent } from "../services/api";
import { Send, Zap, Globe, Code, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Events() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [endpointId, setEndpointId] = useState("");
  const [payload, setPayload] = useState(JSON.stringify({ 
    event: "user.created",
    data: { id: 123, name: "John Doe" }
  }, null, 2));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getEndpoints();
      setEndpoints(data);
    };
    load();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!endpointId) return;

    setLoading(true);
    setStatus(null);
    try {
      await createEvent({
        endpoint_id: Number(endpointId),
        payload: JSON.parse(payload)
      });
      setStatus({ type: 'success', message: 'Event dispatched successfully!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to send event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Trigger Event</h1>
        <p style={{ color: "var(--text-secondary)" }}>Dispatch a payload to your registered webhook endpoints.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
              Target Endpoint
            </label>
            <div style={{ position: "relative" }}>
              <Globe size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <select
                value={endpointId}
                onChange={(e) => setEndpointId(e.target.value)}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem 1rem 0.75rem 2.75rem", 
                  background: "var(--bg-primary)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer"
                }}
                required
              >
                <option value="">Select an endpoint...</option>
                {endpoints.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.url} ({ep.description || 'No description'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                <Code size={16} /> JSON Payload
              </label>
              <button 
                type="button" 
                onClick={() => setPayload(JSON.stringify(JSON.parse(payload), null, 2))}
                style={{ fontSize: "0.75rem", color: "var(--accent)", background: "transparent", fontWeight: 600 }}
              >
                Format JSON
              </button>
            </div>
            
            <textarea
              rows={12}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "1rem", 
                background: "#000", 
                border: "1px solid var(--border)", 
                borderRadius: "var(--radius-sm)",
                color: "#10b981", // Terminal green
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                outline: "none",
                lineHeight: 1.6,
                resize: "vertical"
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !endpointId}
            style={{ 
              padding: "1rem", 
              background: "var(--accent)", 
              color: "white", 
              borderRadius: "var(--radius-sm)", 
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.2s",
              opacity: (loading || !endpointId) ? 0.6 : 1,
              boxShadow: "0 4px 12px var(--accent-faint)"
            }}
          >
            {loading ? "Sending..." : <><Send size={18} /> Dispatch Webhook</>}
          </button>
        </form>

        {status && (
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            borderRadius: "var(--radius-sm)", 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem",
            background: status.type === 'success' ? 'var(--success-faint)' : 'var(--error-faint)',
            color: status.type === 'success' ? 'var(--success)' : 'var(--error)',
            border: `1px solid ${status.type === 'success' ? 'var(--success-faint)' : 'var(--error-faint)'}`
          }}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{status.message}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
        <div style={{ color: "var(--warning)" }}><Zap size={24} /></div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          <strong>Note:</strong> Events are processed asynchronously. Deliveries will attempt immediately and retries will be scheduled automatically on failure.
        </p>
      </div>
    </div>
  );
}