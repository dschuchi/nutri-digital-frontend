import { Card, Typography, Progress, Row, Col, Flex } from 'antd';

const { Text } = Typography;

const MicronutrientsCard = ({ data }) => {
  const safe = (v) => (v == null ? 0 : v);

  const micronutrientes = [
    { label: 'Vitamina A', actual: safe(data.vitamin_a), objetivo: safe(data.goals?.vitamin_a), unit: '%' },
    { label: 'Vitamina C', actual: safe(data.vitamin_c), objetivo: safe(data.goals?.vitamin_c), unit: '%' },
    { label: 'Hierro', actual: safe(data.iron), objetivo: safe(data.goals?.iron), unit: '%' },
    { label: 'Calcio', actual: safe(data.calcium), objetivo: safe(data.goals?.calcium), unit: '%' },
    { label: 'Potasio', actual: safe(data.potassium), objetivo: safe(data.goals?.potassium), unit: 'mg' },
  ];

  return (
    <Card title="Micronutrientes" style={{ padding: '12px 16px', borderRadius: 12 }}>
      <Row justify="space-around" align="bottom" wrap>
        {micronutrientes.map(({ label, actual, objetivo, unit }) => {
          const sinObjetivo = objetivo == null || objetivo === 0;
          const excedido = !sinObjetivo && actual > objetivo;
          const porcentaje = sinObjetivo ? 100 : Math.min((actual / objetivo) * 100, 100);
          const color = excedido ? '#ff4d4f' : '#52c41a';

          return (
            <Col
              key={label}
              xs={12}
              sm={8}
              md={4}
              style={{ textAlign: 'center', marginBottom: 16 }}
            >
              <Flex vertical>
                <Text strong>{label}</Text>
                <Progress
                  type="circle"
                  percent={Math.round(porcentaje)}
                  format={() => <span style={{ color: '#000' }}>{porcentaje.toFixed(0)} %</span>}
                  strokeColor={color}
                  width={70}
                />
              </Flex>

              {!sinObjetivo && (
                <div style={{ marginTop: 4 }}>
                  <Text
                    type={excedido ? 'danger' : 'secondary'}
                    style={{ fontSize: 12 }}
                  >
                    {actual} / {objetivo} {unit}
                  </Text>
                </div>
              )}
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default MicronutrientsCard;