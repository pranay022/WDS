import crypto from 'crypto';

export const generateSignature = (
    secret: string,
    timestamp: string,
    payload: string,
) => {
    const message = `${timestamp}.${payload}`;

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(message);

    return `sha256=${hmac.digest('hex')}`;
}