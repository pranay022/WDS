export const getNextRetryTime = (attempt: number): string | null => {
    const delays = [10, 30, 120, 600];

    if(attempt > delays.length){
        return null;
    }
    
    const delay = delays[attempt - 1];
    if(delay === undefined){
        return null;
    }
    const nextRetry = new Date(Date.now() + delay * 1000);

    return nextRetry.toISOString();
}