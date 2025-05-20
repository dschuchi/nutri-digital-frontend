import httpClient from "./httpClient";

export async function getProfessionals() {
    const res = await httpClient.get('/professional');
    if (!res) {
        throw new Error("Failed to fetch professionals data");
    }
    return res;
}