import httpClient from "./httpClient";

export async function getReviews(idProf) {
    const res = await httpClient.get(`/reviews?professional_id=${idProf}`);
    if (!res) throw new Error('Request failed');
    return res;
}
