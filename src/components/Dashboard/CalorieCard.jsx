import { Card, Typography } from 'antd';
import { AimOutlined, ForkOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CalorieCard = ({ objetivo, alimentos, ejercicio }) => {
  const restantes = objetivo - alimentos + ejercicio;

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={4}>Calorías</Title>
      <Text type="secondary">Restantes = Objetivo - Alimentos + Ejercicio</Text>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Title level={1} style={{ marginBottom: 0 }}>{restantes}</Title>
        <Text>Restantes</Text>
        <div style={{ marginTop: 16 }}>
          <Text><AimOutlined style={{ marginRight: 8 }} />{objetivo} Objetivo</Text><br />
          <Text><ForkOutlined style={{ marginRight: 8 }} />{alimentos} Alimentos</Text><br />
          <Text><FireOutlined style={{ marginRight: 8 }} />{ejercicio} Ejercicio</Text>
        </div>
      </div>
    </Card>
  );
};

export default CalorieCard;
