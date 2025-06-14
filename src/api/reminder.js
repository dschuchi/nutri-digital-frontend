import httpClient from "./httpClient";

export async function getReminder() {
    const res = await httpClient.get('/reminder');
    if (!res) throw new Error('Request failed');
    return res;
}
