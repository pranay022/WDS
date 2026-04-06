export interface Endpoint {
    id: number;
    url: string;
    secret: string;
    description?: string;
    created_at: string;
}

export interface Event {
    id: number;
    endpoint_id: number;
    payload: string;
    status: string;
    next_retry_at: string;
    attempt_count: number;
    attempted_at: string;
}