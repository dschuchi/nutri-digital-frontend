import httpClient from "./httpClient";

export async function newHydration(mililiters) {
    const res = await httpClient.post(`/hidratation`, { mililiters });
    if (!res) {
        throw new Error("Failed to create new hydration record");
    }
    return res;
}

export async function getHydrationHistory(date) {
    const res = await httpClient.get(`/hidratation?date=${date}`);
    if (!res) {
        throw new Error("Failed to fetch hydration history");
    }
    return res;
}

export async function deleteHydration(id) {
    const res = await httpClient.delete(`/hidratation?id=${id}`);
    if (!res) {
        throw new Error("Failed to delete hydration record");
    }
    return res;
}