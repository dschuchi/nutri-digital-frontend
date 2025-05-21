import { useRef, useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Progress, Space } from 'antd';
import { AimOutlined, ForkOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CalorieCard = ({ objetivo, alimentos, ejercicio }) => {
  const cardRef = useRef(null);
  const [scale, setScale] = useState(1);

  const sinObjetivo = objetivo == null || objetivo === 0;
  const restantes = sinObjetivo ? 0 : objetivo - alimentos + ejercicio;
  const exceso = !sinObjetivo && restantes < 0;
  const excedidas = Math.abs(restantes);
  const porcentaje = sinObjetivo ? 100 : Math.min((excedidas / objetivo) * 100, 100);
  const color = exceso ? '#ff4d4f' : '#fa8c16';

  useEffect(() => {
    if (!cardRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      const factor = Math.max(Math.min(width / 450, 1.5), 0.8); // entre 80% y 150%
      setScale(factor);
    });
    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <Card ref={cardRef} style={{ width: '100%', height: '100%', borderRadius: 12 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <Title level={4}>Calorías</Title>
        <Text style={{ fontSize: 12 }} type="secondary">
          Restantes = Objetivo - Alimentos + Ejercicio
        </Text>

        <Row gutter={[8, 8]} align="middle" style={{ marginTop: 16 }}>
          <Col xs={24} sm={8}>
            <Progress
              type="circle"
              percent={porcentaje}
              width={100}
              strokeColor={color}
              format={() => (
                <div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color }}>
                    {sinObjetivo ? alimentos : exceso ? excedidas : restantes}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: exceso ? '#ff4d4f' : 'inherit',
                      fontWeight: exceso ? 'bold' : 'normal',
                    }}
                  >
                    {sinObjetivo ? 'Consumidas' : exceso ? 'Excedidas' : 'Restantes'}
                  </div>
                </div>
              )}
            />
          </Col>

          <Col xs={24} sm={16}>
            <Space direction="vertical" size={8}>
              <Text><AimOutlined style={{ marginRight: 8 }} /> <b>{objetivo}</b> Objetivo base</Text>
              <Text><ForkOutlined style={{ marginRight: 8 }} /> <b>{alimentos}</b> Alimentos</Text>
              <Text><FireOutlined style={{ marginRight: 8 }} /> <b>{ejercicio}</b> Ejercicio</Text>
            </Space>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default CalorieCard;
