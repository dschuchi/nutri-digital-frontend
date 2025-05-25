import httpClient from "./httpClient";

/**
 * Agrega una entrada de consumo para un usuario.
 * @param {Object} data - Datos de la comida consumida.
 * @param {string} data.portion - Cantidad consumida.
 * @param {string} data.unit - Unidad (por ejemplo "g", "ml").
 * @param {string} data.type_of_food - Tipo de comida (ej: "almuerzo").
 * @param {number} data.id_user - ID del usuario.
 * @param {number} data.id_food - ID del alimento.
 * @returns {Promise} Respuesta del servidor.
 */
export async function addConsumedEntry(data) {
  try {
    const response = await httpClient.post("/consumed", data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar consumo:", error);
    throw error;
  }
}

/**
 * Elimina una entrada de consumo por ID.
 * @param {number} id - ID de la entrada de consumo a eliminar.
 * @returns {Promise} Respuesta del servidor.
 */
export async function deleteConsumedEntry(id) {
  try {
    const response = await httpClient.delete(`/consumed?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar consumo:", error);
    throw error;
  }
}

/**
 * Obtiene las entradas de consumo de un usuario para una fecha específica.
 * @param {number} userId - ID del usuario.
 * @param {string} date - Fecha del consumo (formato "YYYY-MM-DD").
 * @returns {Promise} Lista de consumos.
 */
export async function getConsumedEntries(userId, date) {
  try {
    const response = await httpClient.get(`/consumed?userId=${userId}&date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener consumos:", error);
    throw error;
  }
}
