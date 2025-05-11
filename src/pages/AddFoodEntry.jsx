import { Button, Form, InputNumber, Select, Typography, AutoComplete, message } from 'antd';
import { useState } from 'react';
import mockFoods from '../data/mockFoods.json';

const { Option } = Select;

const AddFoodEntry = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  const handleSearch = (value) => {
    const matches = mockFoods.data.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setOptions(matches.map(food => ({
      value: food.name,
      label: `${food.name} (${food.brand})`
    })));
  };

  const onFinish = (values) => {
    if (isNaN(values.portion)) {
      message.error("La porción debe ser un número válido");
      return;
    }
    console.log("Entrada registrada:", values);
    message.success("Alimento registrado exitosamente");
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <Typography.Title level={3}>Registrar consumo de alimento</Typography.Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="food"
          label="Buscar alimento"
          rules={[{ required: true, message: 'Seleccioná un alimento' }]}
        >
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            placeholder="Ej: Pepsi, Pan integral"
          />
        </Form.Item>

        <Form.Item
          name="portion"
          label="Porción"
          rules={[{ required: true, message: 'Ingresá una porción válida' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Cantidad" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unidad"
          rules={[{ required: true, message: 'Seleccioná una unidad' }]}
        >
          <Select placeholder="Unidad">
            <Option value="g">Gramos (g)</Option>
            <Option value="ml">Mililitros (ml)</Option>
            <Option value="taza">Taza</Option>
            <Option value="unidad">Unidad</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="meal"
          label="Momento del día"
          rules={[{ required: true, message: 'Seleccioná cuándo lo consumiste' }]}
        >
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
    </div>
  );
};

export default AddFoodEntry;
