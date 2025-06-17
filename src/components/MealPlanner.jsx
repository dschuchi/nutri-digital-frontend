import { useState, useEffect } from "react";
import { Table, Button, Select, InputNumber, message, Space } from "antd";
import { addPlannedMeal, getPlannedMeals } from "../api/planning.js";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import FoodSearchModal from "./FoodSearchModal";

const { Option } = Select;

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const mealTypes = ["Desayuno", "Almuerzo", "Merienda", "Cena"];

export default function MealPlanner({ embedded = false }) {
  const [data, setData] = useState([]);
  const [day, setDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [portion, setPortion] = useState(1);
  const { user } = useAuth();
  const [foodModalVisible, setFoodModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getPlannedMeals(user.id, day);
      setData(res.data || []);
    } catch (err) {
      message.error("Error al obtener las comidas planificadas");
    }
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user, day]);

  const handleAdd = async () => {
    if (!selectedMeal) return message.warning("Selecciona una comida primero");

    try {
      const payload = {
        id_user: user.id,
        name_food: selectedMeal.name,
        id_food: selectedMeal.id,
        portion: portion.toString(),
        day,
      };
      await addPlannedMeal(payload);
      message.success("Comida planificada exitosamente");
      setSelectedMeal(null);
      setPortion(1);
      fetchData();
    } catch (err) {
      message.error("Error al planificar comida");
    }
  };

  return (
    <div style={{ padding: embedded ? 0 : 24 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space wrap>
          <Select
            placeholder="Día de la semana"
            value={day}
            onChange={setDay}
            style={{ width: 180 }}
          >
            {daysOfWeek.map((d, idx) => (
              <Option key={idx} value={dayjs().day(idx + 1).format("YYYY-MM-DD")}>{d}</Option>
            ))}
          </Select>

          <Button onClick={() => setFoodModalVisible(true)}>Seleccionar comida</Button>

          <InputNumber
            min={1}
            value={portion}
            onChange={setPortion}
            style={{ width: 100 }}
            addonAfter="porciones"
          />

          <Button type="primary" onClick={handleAdd}>Agregar</Button>
        </Space>

        <Table
          dataSource={data}
          rowKey="id"
          columns={[
            { title: "Comida", dataIndex: "name_food", key: "name" },
            { title: "Porción", dataIndex: "portion", key: "portion" },
            { title: "Día", dataIndex: "day", key: "day" },
          ]}
        />
      </Space>

      <FoodSearchModal
        open={foodModalVisible}
        onClose={() => setFoodModalVisible(false)}
        onSelect={(food) => {
          setSelectedMeal(food);
          setFoodModalVisible(false);
          message.success(`Seleccionaste ${food.name}`);
        }}
      />
    </div>
  );
}
