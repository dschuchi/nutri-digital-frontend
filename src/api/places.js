import httpClient from './httpClient';

/**
 * Obtiene todos los lugares desde la API según el origen.
 * @param {string} origin - Ubicación actual del usuario (ej: "Buenos Aires").
 * @returns {Promise<Array>} Arreglo de lugares que coinciden con el origen.
 */
export async function getPlaces(origin) {
  try {
    const query = origin ? `?origin=${encodeURIComponent(origin)}` : '';
    const response = await httpClient.get(`/place${query}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los lugares:', error);
    throw error;
  }
}

