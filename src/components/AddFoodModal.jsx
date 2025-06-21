import { Modal, Form, InputNumber, Select, Button, message, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addConsumedEntry } from '../api/consumed';

const { Option } = Select;

const AddFoodModal = ({ open, onClose, food }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setIsValid(false);
    }
  }, [open]);

  const onFieldsChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length > 0);
    const touchPortion = form.isFieldTouched('portion')
    const touchMeal = form.isFieldTouched('meal')
    const allTouched = touchMeal && touchPortion;
    setIsValid(allTouched && !hasErrors);
  };

  const onFinish = async (values) => {
    const payload = {
      portion: values.portion.toString(),
      unit: values.unit,
      type_of_food: values.meal,
      id_user: user.id,
      id_food: food.id,
    };

    try {
      await addConsumedEntry(payload);
      message.success('Alimento registrado exitosamente');
      onClose();
    } catch (err) {
      message.error('Error al registrar el alimento');
      console.error(err);
    }
  };

  function extraerPorcion(texto) {
    const match = texto.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  }

  return (
    <Modal
      open={open}
      title={`Cargar: ${food?.name || ''}`}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
        initialValues={{
          unit: extraerPorcion(food.name)
        }}
      >
        <Form.Item
          name="portion"
          label="Porción"
          rules={[{ required: true, message: 'Ingresá una porción válida' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Porción" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Tamaño de la porción"
          rules={[{ required: true, message: 'Seleccioná una unidad' }]}
        >
          <Input disabled />
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
          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={!isValid}
          >
            Cargar alimentación
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFoodModal;
