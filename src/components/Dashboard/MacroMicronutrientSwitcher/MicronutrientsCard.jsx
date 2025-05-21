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
        {micronutrientes.map((item) => {
          const { label, actual, objetivo } = item;
          const porcentaje = objetivo > 0 ? (actual / objetivo) * 100 : 0;
          const excedido = porcentaje > 100;

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
                type="dashboard"
                percent={Math.min(porcentaje, 100)}
                showInfo={false}
                strokeColor={excedido ? '#ff4d4f' : '#52c41a'}
                strokeWidth={10}
                style={{ maxHeight: 80, margin: '0 8px' }}
              />
              <div style={{ marginTop: 4 }}>
                <Text
                  type={excedido ? 'danger' : 'secondary'}
                  style={{ fontSize: 12 }}
                >
                  {actual} / {objetivo} ({Math.round(porcentaje)}%)
                </Text>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default MicronutrientsCard;