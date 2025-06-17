import { useState, useEffect } from "react";
import { Table, Button, Select, Input, Space, Typography, Row, Col, message } from "antd";
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { addPlannedMeal, getPlannedMeals } from "../api/planning";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import FoodSearchModal from "./FoodSearchModal";

const { Option } = Select;
const { Text } = Typography;

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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

  const incrementPortion = () => setPortion(prev => Math.min(prev + 1, 99));
  const decrementPortion = () => setPortion(prev => Math.max(prev - 1, 1));
  const handlePortionChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setPortion(val);
    }
  };

  return (
    <div style={{ padding: embedded ? 0 : 24 }}>
      <Row gutter={[16, 16]} align="bottom" style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Text strong>Día de la semana</Text>
          <Select
            value={day}
            onChange={setDay}
            style={{ width: '100%' }}
          >
            {daysOfWeek.map((d, idx) => (
              <Option key={idx} value={dayjs().day(idx + 1).format("YYYY-MM-DD")}>{d}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={6}>
          <Text strong>Comida</Text>
          <Button block onClick={() => setFoodModalVisible(true)}>
            Seleccionar comida
          </Button>
        </Col>

        <Col xs={24} md={8}>
          <Text strong>Porciones</Text><br />
          <Space>
            <Button icon={<MinusOutlined />} onClick={decrementPortion} />
            <Input
              type="number"
              min={1}
              max={99}
              value={portion}
              onChange={handlePortionChange}
              style={{ width: 70, textAlign: 'center' }}
            />
            <Button icon={<PlusOutlined />} onClick={incrementPortion} />
          </Space>
        </Col>

        <Col xs={24} md={4}>
          <Button
            type="primary"
            onClick={handleAdd}
            disabled={!selectedMeal}
            block
            style={{ marginTop: 22 }}
          >
            Agregar
          </Button>
        </Col>
      </Row>

      {selectedMeal && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>Comida seleccionada:</Text>{" "}
          <Text>{selectedMeal.name}</Text>{" "}
          {selectedMeal.brand && (
            <Text type="secondary" style={{ marginLeft: 4 }}>({selectedMeal.brand})</Text>
          )}
        </div>
      )}

      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "Comida", dataIndex: "name_food", key: "name" },
          { title: "Porción", dataIndex: "portion", key: "portion" },
          { title: "Día", dataIndex: "day", key: "day" },
        ]}
        locale={{ emptyText: "No hay comidas planificadas para este día" }}
      />

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