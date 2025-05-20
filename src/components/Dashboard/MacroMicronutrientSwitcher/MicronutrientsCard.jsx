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
    <Card title="Micronutrientes" style={{ borderRadius: 12 }}>
      <Row justify="space-around" align="bottom">
        {micronutrientes.map((item) => (
          <Col key={item.label} style={{ textAlign: 'center' }}>
            <Text>{item.label}</Text>
            <Progress
              type="dashboard"
              percent={(item.actual / item.objetivo) * 100}
              showInfo={false}
              strokeColor="#52c41a"
              strokeWidth={10}
              style={{ height: 100, margin: '0 12px' }}
              format={() => ''}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default MicronutrientsCard;