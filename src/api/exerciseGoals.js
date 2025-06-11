import httpClient from "./httpClient";

export async function getExerciseGoals(userId) {
    const res = await httpClient.get(`/exercise-goals/get?userId=${userId}`);
    if (!res) {
        throw new Error("Failed to fetch exercise goals");
    }
    return res;
}


export async function updateExerciseGoals(data, userId) {
    const res = await httpClient.patch(`/exercise-goals/update?userId=${userId}`, data);
    if (!res) {
        throw new Error("Failed to fetch exercise goals");
    }
    return res;
}