import httpClient from "./httpClient";

export async function getPanelData(date, userId) {
  const res = await httpClient.get(`/progress-panel?date=${date}&userId=${userId}`);
  if (!res) {
    throw new Error("Failed to fetch panel data");
  }
  return res;
}