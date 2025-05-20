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

export async function updateMacroNutrientGoals(data) {
    const res = await httpClient.patch(`/nutrient-goals/macro/update`, data);
    if (!res) {
        throw new Error("Failed to update nutrient goals data");
    }
    return res;
}

export async function updateMicroNutrientGoals(data) {
    const res = await httpClient.patch(`/nutrient-goals/micro/update`, data);
    if (!res) {
        throw new Error("Failed to update nutrient goals data");
    }
    return res;
}