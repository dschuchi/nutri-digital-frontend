import httpClient from "./httpClient";

export async function search(name) {
    const res = await httpClient.get(`/food/search?name=${name}`);
    if (!res) {
        throw new Error("Failed to fetch food data");
    }
    return res;
}

export async function newFood(data) {
    const res = await httpClient.post('/food/add', data);
    if (!res) {
        throw new Error("Failed to post food data");
    }
    return res;
}