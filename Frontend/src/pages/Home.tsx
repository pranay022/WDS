export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Webhook Delivery Service</h1>
      <p>
        This system allows you to register webhook endpoints, send events,
        deliver webhooks automatically with retries, and monitor delivery logs
        in real time.
      </p>

      <h2>How It Works</h2>
      <ul>
        <li>Register webhook endpoint</li>
        <li>Create event</li>
        <li>Worker delivers webhook</li>
        <li>Retries on failure</li>
        <li>Logs delivery attempts</li>
        <li>Dashboard shows real-time logs</li>
      </ul>

      <h2>Tech Stack</h2>
      <ul>
        <li>Node.js + Express</li>
        <li>TypeScript</li>
        <li>SQLite</li>
        <li>node-cron Worker</li>
        <li>Server Sent Events (SSE)</li>
        <li>React + Vite</li>
      </ul>
    </div>
  );
}
