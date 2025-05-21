import { Card, Typography, Progress } from 'antd';

const { Text, Link } = Typography;

const SummaryCard = ({ data }) => {
  return (
    <Card
      title="Resumen personalizado"
      extra={<Link>Cambiar nutrientes</Link>}
      style={{ padding: '12px 16px', borderRadius: 12 }}
    >
      {Object.entries(data).map(([label, val]) => {
        const nombre = label.charAt(0).toUpperCase() + label.slice(1);
        const actual = val?.actual ?? 0;
        const objetivo = val?.objetivo ?? 0;
        const sinObjetivo = objetivo === 0 || objetivo == null;
        const excedido = !sinObjetivo && actual > objetivo;
        const porcentaje = sinObjetivo ? 100 : Math.min((actual / objetivo) * 100, 100);
        const color = excedido ? '#ff4d4f' : '#1890ff';

        return (
          <div key={label} style={{ marginBottom: 12 }}>
            <Text>{nombre}</Text>
            <Progress
              percent={Math.round(porcentaje)}
              showInfo={false}
              strokeColor={color}
              strokeWidth={6}
            />
            <div style={{ marginTop: 4 }}>
              {sinObjetivo ? (
                <Text type="secondary" style={{ fontSize: 12 }}>{actual} g</Text>
              ) : (
                <Text type={excedido ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                  {actual} / {objetivo} g ({Math.round((actual / objetivo) * 100)}%)
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default SummaryCard;
