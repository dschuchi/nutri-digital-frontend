import { Button, Form, InputNumber, Select, Typography, message } from 'antd';
import { useState } from 'react';
import { addConsumedEntry } from '../api/consumed';
import { useAuth } from '../context/AuthContext';
import FoodSearchModal from '../components/FoodSearchModal';

const { Option } = Select;

const AddFoodEntry = () => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { user } = useAuth()

  const onFinish = async (values) => {
    if (isNaN(values.portion)) {
      message.error("La porción debe ser un número válido");
      return;
    }

    if (!selectedFood?.id) {
      message.error("No se ha seleccionado un alimento válido");
      return;
    }

    const payload = {
      portion: values.portion.toString(),
      unit: values.unit,
      type_of_food: values.meal,
      id_user: user.id,
      id_food: selectedFood.id,
    };

    try {
      await addConsumedEntry(payload);
      message.success("Alimento registrado exitosamente");
      form.resetFields();
      setSelectedFood(null);
    } catch (err) {
      message.error("Hubo un error al registrar el consumo");
      console.error(err);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    form.setFieldValue("food", food.name);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography.Title level={3}>Registrar consumo de alimento</Typography.Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="food"
          label="Alimento seleccionado"
          rules={[{ required: true, message: 'Seleccioná un alimento' }]}
        >
          <>
            <Button type="dashed" block onClick={() => setShowModal(true)}>
              {selectedFood ? `${selectedFood.name} (${selectedFood.brand || 'Sin marca'})` : 'Buscar alimento'}
            </Button>
          </>
        </Form.Item>

        <Form.Item name="portion" label="Porción" rules={[{ required: true, message: 'Ingresá una porción válida' }]}>
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Cantidad" />
        </Form.Item>

        <Form.Item name="unit" label="Unidad" rules={[{ required: true, message: 'Seleccioná una unidad' }]}>
          <Select placeholder="Unidad">
            <Option value="g">Gramos (g)</Option>
            <Option value="ml">Mililitros (ml)</Option>
            <Option value="taza">Taza</Option>
            <Option value="unidad">Unidad</Option>
          </Select>
        </Form.Item>

        <Form.Item name="meal" label="Momento del día" rules={[{ required: true, message: 'Seleccioná cuándo lo consumiste' }]}>
          <Select placeholder="Seleccioná">
            <Option value="Desayuno">Desayuno</Option>
            <Option value="Almuerzo">Almuerzo</Option>
            <Option value="Merienda">Merienda</Option>
            <Option value="Cena">Cena</Option>
            <Option value="Aperitivo">Aperitivo</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Registrar alimento
          </Button>
        </Form.Item>
      </Form>

      <FoodSearchModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectFood}
      />
    </div>
  );
};

export default AddFoodEntry;
