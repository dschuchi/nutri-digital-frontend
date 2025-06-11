import { Card, Typography, Progress, Row, Col } from 'antd';

const { Text } = Typography;

const MicronutrientsCard = ({ data }) => {
  const safe = (v) => (v == null ? 0 : v);

  const micronutrientes = [
    { label: 'Vitamina A', actual: safe(data.vitamin_a), objetivo: safe(data.goals?.vitamin_a) },
    { label: 'Vitamina C', actual: safe(data.vitamin_c), objetivo: safe(data.goals?.vitamin_c) },
    { label: 'Hierro', actual: safe(data.iron), objetivo: safe(data.goals?.iron) },
    { label: 'Calcio', actual: safe(data.calcium), objetivo: safe(data.goals?.calcium) },
    { label: 'Potasio', actual: safe(data.potassium), objetivo: safe(data.goals?.potassium) },
  ];

  return (
    <Card title="Micronutrientes" style={{ padding: '12px 16px', borderRadius: 12 }}>
      <Row justify="space-around" align="bottom" wrap>
        {micronutrientes.map(({ label, actual, objetivo }) => {
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
              <Text>{label}</Text>
              <Progress
                type="circle"
                percent={Math.round(porcentaje)}
                format={() => <span style={{ color: '#000' }}>{actual} %</span>}
                strokeColor={color}
                width={70}
              />

              {!sinObjetivo && (
                <div style={{ marginTop: 4 }}>
                  <Text
                    type={excedido ? 'danger' : 'secondary'}
                    style={{ fontSize: 12 }}
                  >
                    {actual} / {objetivo} ({Math.round((actual / objetivo) * 100)}%)
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