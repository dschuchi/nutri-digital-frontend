import httpClient from "./httpClient";

export async function searchMicroNutrientGoals(userId) {
    const res = await httpClient.get(`/nutrient-goals/search?userId=${userId}`);
    if (!res) {
        throw new Error("Failed to fetch nutrient goals data");
    }
    return res;
}
