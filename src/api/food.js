import httpClient from "./httpClient";

export async function search(name) {
    const res = await httpClient.get(`/food/search?name=${name}`);
    if (!res) {
        throw new Error("Failed to fetch food data");
    }
    return res;
}
