import httpClient from "./httpClient";

export async function getReport(idUser) {
    const res = await httpClient.get(`/report?id_user=${idUser}`);
    if (!res) throw new Error('Request failed');
    return res;
}
