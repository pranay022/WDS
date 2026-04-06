import { useEffect, useState } from "react";

export default function Dashboard() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const source = new EventSource("http://locahost:3000/api/stream");

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prev) => [data, ...prev]);
        };

        return() => {
            source.close();
        };
    }, []);

    return (
        <div style={{padding: "20px"}}>
            <h1>LIve Delivery Logs</h1>

            <table border={1} cellSpacing={5}>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Event ID</th>
                        <th>Status</th>
                        <th>Http Code</th>
                        <th>Response Time</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index)=> (
                        <tr key={index} style={{color: log.status === "success" ? "green" : "red"}}>
                            <td>{log.timestamp}</td>
                            <td>{log.event_id}</td>
                            <td>{log.status}</td>
                            <td>{log.status_code || "-"}</td>
                            <td>{log.response_tiem_ms || "-"}</td>
                            <td>{log.error || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}