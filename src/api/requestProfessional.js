import httpClient from "./httpClient";

export async function sendRequest(idProfessional) {
    const res = await httpClient.post(`/request/send?id=${idProfessional}`);
    if (!res) throw new Error('Request failed');
    return res;
}

export async function cancelRequest(idProfessional) {
    const res = await httpClient.post(`/request/cancel?id=${idProfessional}`);
    if (!res) throw new Error('Request cancellation failed');
    return res;
}

export async function approveRequest(idProfessional) {
    const res = await httpClient.post(`/request/approve?id=${idProfessional}`);
    if (!res) throw new Error('Request approval failed');
    return res;
}

export async function getRequestProfessional() {
    const res = await httpClient.get('/request/professional');
    if (!res) throw new Error('Failed to fetch professional requests');
    return res;
}

export async function getRequestClient() {
    const res = await httpClient.get('/request/client');
    if (!res) throw new Error('Failed to fetch client requests');
    return res;
}
