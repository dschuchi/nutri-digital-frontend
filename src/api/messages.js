import httpClient from "./httpClient";

/**
 * Obtiene el historial de mensajes entre el usuario actual y otro usuario.
 * @param {number} targetUserId - ID del otro usuario con quien se intercambiaron mensajes.
 * @returns {Promise} Lista de mensajes.
 */
export async function getMessages(targetUserId) {
    const res = await httpClient.get(`/messages?target_user_id=${targetUserId}`);
    if (!res) {
        console.error("No response in getMessages")
        throw new Error("Failed to fetch messages");
    }
    return res;
}

/**
 * Envía un nuevo mensaje al usuario especificado.
 * @param {number} recipientId - ID del usuario receptor.
 * @param {string} text - Contenido del mensaje.
 * @returns {Promise} Confirmación del envío.
 */
export async function sendMessage(recipientId, text) {
    const res = await httpClient.post('/messages', {
        recipient_user_id: recipientId,
        text_content: text
    });
    if (!res) {
        throw new Error("Failed to send message");
    }
    return res;
}
