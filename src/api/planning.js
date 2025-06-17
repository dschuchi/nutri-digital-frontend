import httpClient from "./httpClient";

export async function addPlannedMeal(data) {
  const res = await httpClient.post("/planning", data);
  if (!res) {
    throw new Error("Failed to add planned meal");
  }
  return res;
}

export async function getPlannedMeals(userId, day) {
  const res = await httpClient.get(`/planning?userId=${userId}&day=${day}`);
  if (!res) {
    throw new Error("Failed to fetch planned meals");
  }
  return res;
}