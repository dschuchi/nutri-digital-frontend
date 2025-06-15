import httpClient from "./httpClient";

export async function sendRequest(idProfessional) {
    const res = await httpClient.post(`/request/send?id=${idProfessional}`);
    if (!res) throw new Error('Request failed');
    return res;
}

export async function cancelRequest(idRequest) {
    const res = await httpClient.post(`/request/cancel?id=${idRequest}`);
    if (!res) throw new Error('Request cancellation failed');
    return res;
}

export async function approveRequest(idRequest) {
    const res = await httpClient.post(`/request/approve?id=${idRequest}`);
    if (!res) throw new Error('Request approval failed');
    return res;
}

// TODO esto se llama cada 'x' segundos, 
// sirve para que el profesional vea las solicitudes pendientes
export async function getRequestProfessional(idProfessional) {
    const res = await httpClient.get(`/request/professional?id=${idProfessional}`);
    if (!res) throw new Error('Failed to fetch professional requests');
    return res;
}

export async function getRequestClient(idUser) {
    const res = await httpClient.get(`/request/client?id=${idUser}`);
    if (!res) throw new Error('Failed to fetch client requests');
    return res;
}

export async function getRequestsPending(idProfessional) {
    const res = await httpClient.get(`/request/pendings?id=${idProfessional}`);
    if (!res) throw new Error('Failed to fetch pending client requests');
    return res;
}
