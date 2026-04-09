import { useEffect, useState, useMemo } from "react";
import { Activity, CheckCircle, XCircle, Clock, Zap, Search, RefreshCcw, Ban } from "lucide-react";
import { getLogs, retryEvent, cancelEvent } from "../services/api";

interface Log {
    timestamp: string;
    event_id: string | number;
    status: string;
    status_code?: number;
    response_time_ms?: number;
    error?: string;
}

export default function Dashboard() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | number | null>(null);

    const loadInitialLogs = async () => {
        try {
            const data = await getLogs();
            // Map backend log fields to frontend Log interface
            const mappedLogs = data.map((l: any) => ({
                timestamp: l.attempted_at,
                event_id: l.event_id,
                status: l.success ? "success" : "failed",
                status_code: l.status_code,
                response_time_ms: l.response_time_ms,
                error: l.error_message
            }));
            setLogs(mappedLogs);
        } catch (error) {
            console.error("Failed to load initial logs:", error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        loadInitialLogs();

        const apiBase = import.meta.env.API_URL || "http://localhost:3000/api";
        const source = new EventSource(`${apiBase}/stream`);

        source.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLogs((prev) => {
                    const existingIndex = prev.findIndex(l => String(l.event_id) === String(data.event_id));
                    if (existingIndex !== -1) {
                        const newLogs = [...prev];
                        newLogs[existingIndex] = { ...newLogs[existingIndex], ...data };
                        return newLogs;
                    }
                    return [data, ...prev].slice(0, 100);
                });
            } catch (err) {
                console.error("Error parsing stream data:", err);
            }
        };

        source.onerror = () => {
            console.error("SSE connection failed");
            source.close();
        };

        return () => {
            source.close();
        };
    }, []);

    const handleRetry = async (eventId: string | number) => {
        setActionLoading(eventId);
        try {
            await retryEvent(eventId);
            // Optionally we could add a temporary local log or just wait for SSE
        } catch (error) {
            alert("Failed to manual retry");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancel = async (eventId: string | number) => {
        setActionLoading(eventId);
        try {
            await cancelEvent(eventId);
        } catch (error) {
            alert("Failed to cancel event");
        } finally {
            setActionLoading(null);
        }
    };

    const stats = useMemo(() => {
        const total = logs.length;
        const success = logs.filter(l => l.status === "success").length;
        const errors = logs.filter(l => l.status === "failed").length;
        const avgResponse = logs.length > 0
            ? Math.round(logs.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) / logs.length)
            : 0;

        return [
            { label: "Total Requests", value: total, icon: Activity, color: "var(--accent)" },
            { label: "Success Rate", value: total > 0 ? `${Math.round((success / total) * 100)}%` : "0%", icon: CheckCircle, color: "var(--success)" },
            { label: "Failures", value: errors, icon: XCircle, color: "var(--error)" },
            { label: "Avg Latency", value: `${avgResponse}ms`, icon: Clock, color: "var(--warning)" },
        ];
    }, [logs]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const idMatch = String(log.event_id || "").toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = String(log.status || "").toLowerCase().includes(searchTerm.toLowerCase());
            return idMatch || statusMatch;
        });
    }, [logs, searchTerm]);

    return (
        <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Live Delivery Logs</h1>
                    <p style={{ color: "var(--text-secondary)" }}>Real-time monitoring of webhook delivery attempts.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ padding: "0.75rem", borderRadius: "12px", background: `${stat.color}15`, color: stat.color }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>{stat.label}</p>
                                <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Logs Table Section */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ position: "relative", width: "300px" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                        <input
                            type="text"
                            placeholder="Filter by Event ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.6rem 1rem 0.6rem 2.5rem",
                                background: "var(--bg-primary)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-sm)",
                                color: "var(--text-primary)",
                                outline: "none",
                                fontSize: "0.875rem"
                            }}
                        />
                    </div>

                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border)" }}>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Time</th>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Event ID</th>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Status</th>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }} className="mobile-hide">HTTP</th>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }} className="mobile-hide">Latency</th>
                                <th style={{ padding: "1rem 1.25rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="table-row-hover">
                                        <td style={{ padding: "1rem 1.25rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "-"}
                                        </td>
                                        <td style={{ padding: "1rem 1.25rem", fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                                            {log.event_id}
                                        </td>
                                        <td style={{ padding: "1rem 1.25rem" }}>
                                            <span className={`badge ${log.status === "success" ? "badge-success" :
                                                    log.status === "cancelled" ? "badge-warning" :
                                                        "badge-error"
                                                }`}>
                                                {log.status === "success" && <CheckCircle size={12} />}
                                                {log.status === "failed" && <XCircle size={12} />}
                                                {log.status === "cancelled" && <Ban size={12} />}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: "1rem 1.25rem", fontWeight: 600, fontSize: "0.875rem" }} className="mobile-hide">
                                            {log.status_code || "-"}
                                        </td>
                                        <td style={{ padding: "1rem 1.25rem", color: "var(--text-secondary)", fontSize: "0.875rem" }} className="mobile-hide">
                                            {log.response_time_ms ? `${log.response_time_ms}ms` : "-"}
                                        </td>
                                        <td style={{ padding: "1rem 1.25rem" }}>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {log.status === "failed" && (
                                                    <button
                                                        onClick={() => handleRetry(log.event_id)}
                                                        disabled={actionLoading === log.event_id}
                                                        style={{ padding: "4px", borderRadius: "4px", background: "var(--accent-faint)", color: "var(--accent)" }}
                                                        title="Retry Manually"
                                                    >
                                                        <RefreshCcw size={14} className={actionLoading === log.event_id ? "animate-spin" : ""} />
                                                    </button>
                                                )}
                                                {log.status === "failed" && (
                                                    <button
                                                        onClick={() => handleCancel(log.event_id)}
                                                        disabled={actionLoading === log.event_id}
                                                        style={{ padding: "4px", borderRadius: "4px", background: "var(--error-faint)", color: "var(--error)" }}
                                                        title="Stop Retrying"
                                                    >
                                                        <Ban size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                                        {isInitialLoading ? (
                                            <p>Loading logs...</p>
                                        ) : (
                                            <>
                                                <Zap size={48} style={{ marginBottom: "1rem", opacity: 0.2 }} />
                                                <p>No delivery logs found. Waiting for events...</p>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .table-row-hover:hover {
                    background: var(--bg-tertiary);
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}

