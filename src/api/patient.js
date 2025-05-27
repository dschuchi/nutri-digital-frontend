import httpClient from "./httpClient";

export async function getMyProfessional(id) {
    const res = await httpClient.get(`/patient/myprofessional?id=${id}`);	
    if (!res) {
        throw new Error("Failed to fetch professional data");
    }
    return res;
}

export async function getMyPatients(id) {
    const res = await httpClient.get(`/patient/mypatients?id=${id}`);	
    if (!res) {
        throw new Error("Failed to fetch patient data");
    }
    return res;
}