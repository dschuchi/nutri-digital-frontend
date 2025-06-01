import httpClient from "./httpClient";

export async function newExercise(data) {
    const res = await httpClient.post(`/exercise`, data);
    if (!res) {
        throw new Error("Failed to create new exercise record");
    }
    return res;
}

export async function getExerciseHistory(date) {
    const res = await httpClient.get(`/exercise?date=${date}`);
    if (!res) {
        throw new Error("Failed to fetch exercise history");
    }
    return res;
}

export async function deleteExercise(id) {
    const res = await httpClient.delete(`/exercise?id=${id}`);
    if (!res) {
        throw new Error("Failed to delete exercise record");
    }
    return res;
}