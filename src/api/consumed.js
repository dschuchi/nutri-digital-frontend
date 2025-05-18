import httpClient from "./httpClient";

/**
 * Envía una entrada de consumo al servidor.
 * @param {Object} data - Datos de la comida consumida.
 * @param {string} data.portion - Cantidad consumida.
 * @param {string} data.unit - Unidad (por ejemplo "g", "ml").
 * @param {string} data.type_of_food - Tipo (por ejemplo "desayuno", "almuerzo").
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
