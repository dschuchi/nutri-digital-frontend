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

export async function deletePlannedMeal(userId, foodId, day) {
  const res = await httpClient.delete(`/planning?userId=${userId}&foodId=${foodId}&day=${day}`);
  if (!res) {
    throw new Error("Failed to delete planned meal");
  }
  return res;
}

export async function deleteAllPlanning() {
  const res = await httpClient.delete("/planning/all");
  if (!res) {
    throw new Error("Failed to delete all planning data");
  }
  return res;
}

export async function updatePlannedMeal(userId, foodId, day, updatedData) {
  const res = await httpClient.patch(
    `/planning/update?userId=${userId}&foodId=${foodId}&day=${day}`,
    updatedData
  );
  if (!res) {
    throw new Error("Failed to update planned meal");
  }
  return res;
}
