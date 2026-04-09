# Webhook Delivery Service (WDS)

WDS is a robust, lightweight, and modern internal infrastructure tool designed to send, track, and manage webhooks at scale. Built for reliability, it includes features like automated retries, real-time observability via Server-Sent Events (SSE), and a dashboard for monitoring delivery health.

![WDS Logo](Frontend/public/logo.png)

## 🚀 Features

- **Reliable Webhook Delivery**: Automated delivery tracking and status management.
- **Intelligent Retries**: Built-in retry logic with backoff support for failed delivery attempts.
- **Real-time Observability**: Live-streaming delivery logs to the dashboard using SSE.
- **Endpoint Management**: Register and manage multiple webhook destinations with custom secrets and descriptions.
- **Modern Dashboard**: A minimalist, high-performance UI for monitoring live webhook traffic.
- **Developer First**: Simple API-based integration for triggering events from any backend system.

## 🛠️ Tech Stack

### Frontend
- **React**: Modern component-based UI.
- **Vite**: Ultra-fast development environment and build tool.
- **Lucide React**: Premium iconography.
- **SSE (Server-Sent Events)**: Real-time, server-to-client data streaming.
- **Vanilla CSS**: Custom-designed, premium UI system (No UI libraries like Bootstrap).

### Backend
- **Node.js & Express**: High-performance API server.
- **TypeScript**: Type-safe development.
- **SQLite (better-sqlite3)**: Persistent, file-based database.
- **Node-Cron**: Task scheduling for background delivery attempts.
- **Axios**: Reliable HTTP delivery mechanism.

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WDS
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   # Create a .env file (see Configuration)
   npm run dev
   ```

## ⚙️ Configuration

### Frontend (.env)
Create a `.env` file in the `Frontend` directory:
```env
API_URL=http://localhost:3000/api
```

## 🔌 API Endpoints

- `GET /api/endpoints`: List all registered endpoints.
- `POST /api/endpoints`: Register a new webhook endpoint.
- `POST /api/events`: Trigger a new webhook event.
- `GET /api/logs`: Fetch recent delivery attempts.
- `GET /api/stream`: Subscribe to the real-time SSE delivery log stream.

## ⚖️ License
This project is licensed under the ISC License.
