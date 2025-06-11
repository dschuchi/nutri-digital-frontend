import { getPanelData } from '../api/progressPanel';
import { getConsumedEntries } from '../api/consumed';
import { getExerciseHistory, getAllExercises } from '../api/exercise';
import { getExerciseGoals } from '../api/exerciseGoals';

/**
 * Construye la estructura tipo mockPatients para un paciente y una fecha dada.
 * @param {number} userId - ID del paciente.
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @param {string} name - Nombre del paciente (opcional).
 * @returns {Promise<Object>} Paciente con estructura similar a mockPatients.
 */
export async function getPatientData(userId, date, name = `Paciente ${userId}`) {
  try {
    const [panelRes, consumedRes, exercisesRes, exerciseTypesRes, exerciseGoalRes] = await Promise.all([
      getPanelData(date, userId),
      getConsumedEntries(userId, date),
      getExerciseHistory(date, userId),
      getAllExercises(),
      getExerciseGoals(userId),
    ]);

    const panelData = panelRes.data || {};
    const consumedList = consumedRes;
    const allExercises = exercisesRes.data || [];
    const exerciseTypes = exerciseTypesRes.data || [];
    const exerciseGoal = exerciseGoalRes.data?.[0]?.calories_burned_goal || 0;

    console.log("panelRes: ",panelRes);
    console.log("panelData: ",panelData);

    console.log("consumedList: ",consumedList);
    console.log("allExercises: ",allExercises);
    console.log("exerciseTypes: ",exerciseTypes);
    console.log("exerciseGoal: ",exerciseGoal);

    // Filtramos solo los ejercicios del usuario actual
    const ejerciciosUsuario = allExercises.filter(e => e.id_user === userId);

    const consumed = panelData.consumed || {};
    const goals = panelData.goals || {};

    const nutrientKeys = Object.keys(goals).filter(k => k !== 'id' && k !== 'id_user');
    const objetivosCumplidos = nutrientKeys.filter(k => {
      const consumido = consumed[k];
      const objetivo = goals[k];
      return consumido != null && objetivo != null && consumido <= objetivo;
    }).length;

    const historialEjercicio = ejerciciosUsuario.map(e => {
      const tipo = exerciseTypes.find(t => t.id === e.id_exercise_type);
      return {
        id: e.id,
        nombreEjercicio: tipo?.name || 'Ejercicio desconocido',
        caloriasQuemadas: e.calories_burned,
        fecha: date,
      };
    });

    const caloriasEjercicio = historialEjercicio.reduce((acc, curr) => acc + curr.caloriasQuemadas, 0);

    return {
      id: userId,
      name,
      resumen: {
        caloriasConsumidas: consumed.calories || 0,
        caloriasObjetivo: goals.calories || 0,
        caloriasEjercicio,
        objetivosCumplidos,
        totalObjetivos: nutrientKeys.length,
      },
      historialNutricion: consumedList.map((item) => ({
        id: item.id,
        alimento: item.name,
        fecha: date,
        kcal: item.calories || 0,
        proteina: item.protein || 0,
        grasa: item.total_fat || 0,
        carbohidrato: item.total_carbs || 0,
      })),
      historialEjercicio,
      objetivosNutricionales: {
        calories: goals.calories || 0,
        total_fat: goals.total_fat || 0,
        total_carbs: goals.total_carbs || 0,
        protein: goals.protein || 0,
        saturated_fat: goals.saturated_fat || 0,
        sugar: goals.sugar || 0,
      },
      objetivoEjercicio: {
        calories_burned_goal: exerciseGoal,
      },
    };
  } catch (error) {
    console.error('Error al obtener datos del paciente:', error);
    throw error;
  }
}
