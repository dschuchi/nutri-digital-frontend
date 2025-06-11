import httpClient from "./httpClient";
import { useAuth } from '../context/AuthContext';

export async function newExercise(data) {
    const res = await httpClient.post(`/exercise`, data);
    if (!res) {
        throw new Error("Failed to create new exercise record");
    }
    return res;
}

export async function getExerciseHistory(date, userId) {
    const res = await httpClient.get(`/exercise?date=${date}&userId=${userId}`);
    if (!res) {
        throw new Error("Failed to fetch exercise history");
    }
    return res;
}

export async function deleteExercise(id) {
    const res = await httpClient.delete(`/exercise?id=${id}`);
    if (!res) {
        throw new Error("Failed to delete exercise record");
    }
    return res;
}

export async function getAllExercises() {
    const res = await httpClient.get('/exercise/all')
    if (!res) {
        throw new Error('Failed to fetch all exercises')
    }
    return res
}