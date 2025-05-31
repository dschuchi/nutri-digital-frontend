import httpClient from "./httpClient";

export async function getExerciseGoals() {
    const res = await httpClient.get('/exercise-goals/get');
    if (!res) {
        throw new Error("Failed to fetch exercise goals");
    }
    return res;
}


export async function updateExerciseGoals(data) {
    const res = await httpClient.patch('/exercise-goals/update', data);
    if (!res) {
        throw new Error("Failed to fetch exercise goals");
    }
    return res;
}