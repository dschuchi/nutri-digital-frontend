import { Table, Typography } from 'antd';

const { Title } = Typography;

export default function HistorialEjercicio({ paciente }) {
  if (!paciente?.historialEjercicio?.length) return <p>No hay datos de ejercicio disponibles.</p>;

  const columns = [
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Ejercicio', dataIndex: 'nombreEjercicio', key: 'nombreEjercicio' },
    { title: 'Calorías quemadas', dataIndex: 'caloriasQuemadas', key: 'caloriasQuemadas' },
  ];

  return (
    <div>
      <Title level={4}>Historial de ejercicio</Title>
      <Table
        columns={columns}
        dataSource={paciente.historialEjercicio}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}
