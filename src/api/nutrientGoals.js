import httpClient from "./httpClient";

export async function getMicroNutrientGoals(userId) {
    const res = await httpClient.get(`/nutrient-goals/micro?userId=${userId}`);
    if (!res) {
        throw new Error("Failed to fetch nutrient goals data");
    }
    return res;
}

export async function getMacroNutrientGoals(userId) {
    const res = await httpClient.get(`/nutrient-goals/macro?userId=${userId}`);
    if (!res) {
        throw new Error("Failed to fetch nutrient goals data");
    }
    return res;
}