import httpClient from "./httpClient";

export async function getReviews(idProf) {
    const res = await httpClient.get(`/reviews?professional_id=${idProf}`);
    if (!res) throw new Error('Request failed');
    return res;
}

export async function postReview(data) {
    const res = await httpClient.post('/reviews', data);
    if (!res) throw new Error('Post review failed');
    return res;
}
