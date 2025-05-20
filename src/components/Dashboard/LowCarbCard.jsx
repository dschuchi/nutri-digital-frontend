import { Card, Typography, Progress } from 'antd';

const { Text } = Typography;

const LowCarbCard = ({ data }) => {
  return (
    <Card title="Con bajo contenido de carbohidratos" style={{ borderRadius: 12 }}>
      {Object.entries(data).map(([label, val]) => (
        <div key={label}>
          <Text>{label.charAt(0).toUpperCase() + label.slice(1)}</Text>
          <Progress
            percent={(val.actual / val.max) * 100}
            showInfo={false}
            strokeColor="#1890ff"
            strokeWidth={6}
          />
        </div>
      ))}
    </Card>
  );
};

export default LowCarbCard;
