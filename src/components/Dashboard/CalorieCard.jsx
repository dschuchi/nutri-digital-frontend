import { Card, Typography, Progress, Space } from 'antd';
import { AimOutlined, ForkOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CalorieCard = ({ objetivo, alimentos, ejercicio }) => {
  const restantes = objetivo - alimentos + ejercicio;
  const exceso = restantes < 0;
  const excedidas = Math.abs(restantes);
  const porcentaje = Math.min(excedidas / objetivo * 100, 100);
  const color = exceso ? '#ff4d4f' : '#fa8c16';

  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={4}>Calorías</Title>
      <Text type="secondary">Restantes = Objetivo - Alimentos + Ejercicio</Text>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
        {/* Círculo de progreso con valor grande */}
        <div style={{ width: 120, height: 120, marginRight: 24 }}>
          <Progress
            type="circle"
            percent={porcentaje}
            width={120}
            strokeColor={color}
            format={() => (
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color }}>
                  {exceso ? excedidas : restantes}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: exceso ? '#ff4d4f' : 'inherit',
                    fontWeight: exceso ? 'bold' : 'normal'
                  }}
                >
                  {exceso ? 'Excedido' : 'Restantes'}
                </div>
              </div>
            )}
          />
        </div>

        {/* Detalle a la derecha */}
        <div>
          <Space direction="vertical" size={8}>
            <Text><AimOutlined style={{ marginRight: 8 }} /> <b>{objetivo}</b> Objetivo base</Text>
            <Text><ForkOutlined style={{ marginRight: 8 }} /> <b>{alimentos}</b> Alimentos</Text>
            <Text><FireOutlined style={{ marginRight: 8 }} /> <b>{ejercicio}</b> Ejercicio</Text>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default CalorieCard;