import httpClient from "./httpClient";

export async function getPanelData() {
    const res = await httpClient.get(`/progress-panel`);
    if (!res) {
        throw new Error("Failed to fetch panel data");
    }
    console.log("Panel Data: ", res);
    return res;
}
