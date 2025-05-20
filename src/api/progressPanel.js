import httpClient from "./httpClient";

export async function getPanelData(date) {
    const res = await httpClient.get(`/progress-panel?date=${date}`);
    if (!res) {
        throw new Error("Failed to fetch panel data");
    }
    return res;
}
