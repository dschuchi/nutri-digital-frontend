import { useState } from 'react';
import { Card, Typography, Progress, Modal, Checkbox, Button } from 'antd';

const { Text, Link } = Typography;

const nutrientLabels = {
  total_carbs: 'Carbohidratos',
  total_fat: 'Grasas',
  protein: 'Proteínas',
  saturated_fat: 'Grasa saturada',
  polyunsaturated_fat: 'Grasa poliinsaturada',
  monounsaturated_fat: 'Grasa monoinsaturada',
  trans: 'Grasa trans',
  cholesterol: 'Colesterol',
  sodium: 'Sodio',
  potassium: 'Potasio',
  fiber: 'Fibra',
  sugar: 'Azúcar',
  vitamin_a: 'Vitamina A',
  vitamin_c: 'Vitamina C',
  calcium: 'Calcio',
  iron: 'Hierro',
};

const SummaryCard = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(['total_carbs', 'total_fat', 'protein']);
  const [tempSelected, setTempSelected] = useState(['total_carbs', 'total_fat', 'protein']);

  const handleOpen = () => {
    setTempSelected(selected);
    setVisible(true);
  }
  const handleClose = () => setVisible(false);
  const handleConfirm = (newSelected) => {
    setSelected(newSelected);
    handleClose();
  };

  const nutrientUnits = {
    calories: 'kcal',
    total_carbs: '%',
    total_fat: '%',
    protein: '%',
    saturated_fat: 'g',
    polyunsaturated_fat: 'g',
    monounsaturated_fat: 'g',
    trans: 'g',
    cholesterol: 'mg',
    sodium: 'mg',
    potassium: 'mg',
    fiber: 'g',
    sugar: 'g',
    vitamin_a: '%DV',
    vitamin_c: '%DV',
    calcium: '%DV',
    iron: '%DV',
  };


  return (
    <>
      <Card
        title="Resumen personalizado"
        extra={<Link onClick={handleOpen}>Cambiar nutrientes</Link>}
        style={{ padding: '12px 16px', borderRadius: 12 }}
      >
        {selected.map((key) => {
          const actual = data[key]?.actual;
          if (actual == null) return null;

          return (
            <div key={key} style={{ marginBottom: 12 }}>
              <Text>{(nutrientLabels[key] || key).charAt(0).toUpperCase() + (nutrientLabels[key] || key).slice(1)}</Text>
              <Progress
                percent={100} // en esta vista no hay objetivo, solo valor absoluto
                showInfo={false}
                strokeColor="#1890ff"
                strokeWidth={6}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {actual} {nutrientUnits[key] || ''}
              </Text>
            </div>
          );
        })}
      </Card>

      <Modal
        title="Seleccionar nutrientes"
        open={visible}
        onCancel={handleClose}
        onOk={() => handleConfirm(tempSelected)}
        okText="Guardar"
      >
        <Checkbox.Group
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          value={tempSelected} // 👈 esta es la clave
          onChange={(val) => setTempSelected(val)}
        >
          {Object.keys(data).map((key) => (
            <Checkbox key={key} value={key}>
              {nutrientLabels[key] || key}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default SummaryCard;
