const API_BASE = import.meta.env.API_URL || "http://localhost:3000/api";

export const getEndpoints = async () => {
    const res = await fetch(`${API_BASE}/endpoints`);
    return res.json();
}

export const createEndpoint = async (data: any) => {
    const res = await fetch(`${API_BASE}/endpoints`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();
}

export const deleteEndpoint = async (id: number) => {
    await fetch(`${API_BASE}/endpoints/${id}`, {
        method: "DELETE"
    });
};

export const createEvent = async (data: any) => {
    const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();
};

export const getLogs = async () => {
    const res = await fetch(`${API_BASE}/logs`);
    return res.json();
}

export const retryEvent = async (id: string | number) => {
    const res = await fetch(`${API_BASE}/events/${id}/retry`, {
        method: "POST"
    });
    return res.json();
}

export const cancelEvent = async (id: string | number) => {
    const res = await fetch(`${API_BASE}/events/${id}/cancel`, {
        method: "POST"
    });
    return res.json();
}