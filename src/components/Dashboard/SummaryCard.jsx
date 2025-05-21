import { Card, Typography, Progress } from 'antd';

const { Text, Link } = Typography;

const SummaryCard = ({ data }) => {
  return (
    <Card title="Resumen personalizado" extra={<Link>Cambiar nutrientes</Link>} style={{ padding: '12px 16px', borderRadius: 12 }}>
      {Object.entries(data).map(([label, val]) => (
        <div key={label}>
          <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
          <Progress
            percent={(val.actual / val.objetivo) * 100}
            showInfo={false}
            strokeColor="#1890ff"
            strokeWidth={6}
          />
        </div>
      ))}
    </Card>
  );
};

export default SummaryCard;
