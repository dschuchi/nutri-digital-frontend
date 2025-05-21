import { Card, Typography, Progress } from 'antd';

const { Text } = Typography;

const HealthyHeartCard = ({ data }) => {
  return (
    <Card title="Corazón saludable" style={{ padding: '12px 16px', borderRadius: 12 }}>
      {Object.entries(data).map(([label, val]) => {
        const nombre = label.charAt(0).toUpperCase() + label.slice(1);
        const actual = val?.actual ?? 0;
        const max = val?.max ?? 0;
        const sinLimite = max === 0 || max == null;
        const excedido = !sinLimite && actual > max;
        const porcentaje = sinLimite ? 100 : Math.min((actual / max) * 100, 100);
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
              {sinLimite ? (
                <Text type="secondary" style={{ fontSize: 12 }}>{actual} mg</Text>
              ) : (
                <Text type={excedido ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                  {actual} / {max} mg ({Math.round((actual / max) * 100)}%)
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default HealthyHeartCard;
