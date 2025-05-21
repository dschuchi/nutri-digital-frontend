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

/**
 * Elimina una entrada de consumo para un usuario.
 * @param {Object} data - Datos de la entrada a eliminar.
 * @param {number} data.id_user - ID del usuario.
 * @param {number} data.id_food - ID del alimento.
 * @param {string} data.date_consumed - Fecha del consumo (formato "YYYY-MM-DD").
 * @returns {Promise} Respuesta del servidor.
 */
export async function deleteConsumedEntry(data) {
  try {
    const response = await httpClient.delete("/consumed", {
      data: data, // Axios permite pasar el body en DELETE usando la opción `data`
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar consumo:", error);
    throw error;
  }
}
