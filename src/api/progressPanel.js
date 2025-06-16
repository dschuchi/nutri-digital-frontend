import httpClient from "./httpClient";

export async function getPanelData(date, userId, dateFrom) {
  dateFrom = dateFrom || date
  const res = await httpClient.get(`/progress-panel?dateFrom=${dateFrom}&date=${date}&userId=${userId}`);
  if (!res) {
    throw new Error("Failed to fetch panel data");
  }
  return res;
}