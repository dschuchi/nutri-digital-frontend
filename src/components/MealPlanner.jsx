import { useState, useEffect } from "react";
import { Table, Button, Select, Input, Space, Typography, Row, Col, message, Popconfirm, Modal } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { addPlannedMeal, getPlannedMeals, deletePlannedMeal, updatePlannedMeal, deleteAllPlanning } from "../api/planning";
import { useAuth } from "../context/AuthContext";
import FoodSearchModal from "./FoodSearchModal";
import { ResumenNutricionalMealPlanner } from "./ResumenNutricionalMealPlanner";

const { Option } = Select;
const { Text, Title } = Typography;

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function MealPlanner({ embedded = false, userId: targetUserId }) {
  const [data, setData] = useState([]);
  const [day, setDay] = useState("Lunes");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [portion, setPortion] = useState(1);
  const { user } = useAuth();
  const actualUserId = targetUserId || user?.id;
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [macros, setMacros] = useState({});
  const [goals, setGoals] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingPortion, setEditingPortion] = useState(1);

  const fetchData = async () => {
    try {
      const res = await getPlannedMeals(actualUserId, day);
      const {
        userPlanningMeal = [],
        macrosPlanningMeal = {},
        macrosGoals = {}
      } = res.data || {};
      setData(userPlanningMeal);
      if (!macrosPlanningMeal) setMacros(macrosPlanningMeal);
      if (!macrosGoals) setGoals(macrosGoals);
    } catch (err) {
      message.error("Error al obtener las comidas planificadas");
    }
  };

  useEffect(() => {
    if (actualUserId) fetchData();
  }, [actualUserId, day]);

  const handleAdd = async () => {
    if (!selectedMeal) return message.warning("Selecciona una comida primero");

    try {
      const payload = {
        id_user: actualUserId,
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

  const handleDelete = async (foodId) => {
    try {
      await deletePlannedMeal(actualUserId, foodId, day);
      message.success("Comida eliminada exitosamente");
      fetchData();
    } catch (err) {
      message.error("Error al eliminar comida");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditingPortion(parseInt(record.portion));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        id_user: actualUserId,
        name_food: editingRecord.name_food,
        id_food: editingRecord.id_food,
        portion: editingPortion.toString(),
        day,
      };
      await updatePlannedMeal(actualUserId, editingRecord.id_food, day, payload);
      message.success("Comida actualizada exitosamente");
      setEditingRecord(null);
      fetchData();
    } catch (err) {
      message.error("Error al actualizar comida");
    }
  };

  const confirmClearAll = () => {
    Modal.confirm({
      title: "¿Seguro que deseas descartar toda la planificación?",
      icon: <ExclamationCircleOutlined />,
      okText: "Sí",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteAllPlanning();
          message.success("Planificación eliminada exitosamente");
          fetchData();
        } catch (err) {
          message.error("Error al eliminar la planificación completa");
        }
      }
    });
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
            {daysOfWeek.map((d) => (
              <Option key={d} value={d}>{d}</Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={6}>
          <Text strong>Comida</Text>
          <Button block onClick={() => setFoodModalVisible(true)}>
            Seleccionar comida
          </Button>
        </Col>

        <Col xs={24} md={12}>
          <Text strong>Porciones</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
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
            <Button
              type="primary"
              onClick={handleAdd}
              disabled={!selectedMeal}
            >
              Agregar
            </Button>
            <Button danger onClick={confirmClearAll}>
              Descartar planificación
            </Button>
          </div>
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

      <ResumenNutricionalMealPlanner macros={macros} goals={goals}/>

      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "Comida", dataIndex: "name_food", key: "name" },
          { title: "Porción", dataIndex: "portion", key: "portion" },
          { title: "Día", dataIndex: "day", key: "day" },
          {
            title: "",
            key: "actions",
            render: (_, record) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                <Popconfirm
                  title="¿Eliminar esta comida?"
                  onConfirm={() => handleDelete(record.id_food)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>
            )
          }
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

      <Modal
        title="Editar porción"
        open={!!editingRecord}
        onCancel={() => setEditingRecord(null)}
        onOk={handleUpdate}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Input
          type="number"
          min={1}
          max={99}
          value={editingPortion}
          onChange={(e) => setEditingPortion(parseInt(e.target.value))}
          style={{ width: 100 }}
        />
      </Modal>
    </div>
  );
}