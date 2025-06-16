import { Table, Typography } from 'antd';

const { Title } = Typography;

export default function HistorialNutricion({ paciente }) {
  if (!paciente?.historialNutricion?.length) return <p>No hay datos de nutrición disponibles.</p>;

  const columns = [
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Alimento', dataIndex: 'alimento', key: 'alimento' },
    { title: 'Calorías', dataIndex: 'kcal', key: 'kcal' },
    { title: 'Proteína (g)', dataIndex: 'proteina', key: 'proteina' },
    { title: 'Grasa (g)', dataIndex: 'grasa', key: 'grasa' },
    { title: 'Carbohidrato (g)', dataIndex: 'carbohidrato', key: 'carbohidrato' },
  ];

  return (
    <div>
      <Title level={4}>Historial de nutrición</Title>
      <Table
        columns={columns}
        dataSource={paciente.historialNutricion}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
