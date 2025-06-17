import httpClient from "./httpClient";

export async function addPlannedMeal(data) {
  const res = await httpClient.post("/planning", data);
  if (!res) {
    throw new Error("Failed to add planned meal");
  }
  return res;
}

export async function getPlannedMeals(userId, day) {
  try {
    const res = await httpClient.get(`/planning?userId=${userId}&day=${day}`);
    return res;
  } catch (err) {
    console.log("err: ", err);
    if (err?.status === 500 && err.data?.message === 'Planning not found') {
      return {
        data: {
          userPlanningMeal: [],
          macrosPlanningMeal: 0,
          macrosGoals: 0
        }
      };
    }
    throw err;
  }
}