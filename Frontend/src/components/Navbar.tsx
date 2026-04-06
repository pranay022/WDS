import { Link } from "react-router-dom";


export default function Navbar() {
    return(
        <nav style={{ padding: "10px", background: "#111", color: "#0f0" }} >
            <h2>Webhook Delivery Service</h2>
            <div style={{display:"flex", gap: "15px"}}>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/endpoints">Endpoints</Link>
                <Link to="/events">Events</Link>
            </div>
        </nav>
    )
}