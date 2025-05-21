import { Card, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

const MacroCard = ({ data }) => {
  return (
    <Card style={{ padding: '12px 16px', borderRadius: 12 }}>
      <Title level={4}>Macronutrientes</Title>
      <Row justify="space-around">
        {Object.entries(data).map(([key, val]) => (
          <Col key={key} style={{ textAlign: 'center' }}>
            <Text strong>{key.charAt(0).toUpperCase() + key.slice(1)}</Text><br />
            <div
              style={{
                border: '2px solid #eee',
                borderRadius: '50%',
                width: 60,
                height: 60,
                lineHeight: '60px',
                margin: '8px auto'
              }}
            >
              {val.actual}
            </div>
            <Text style={{ fontSize: 12 }} type="secondary">{val.objetivo - val.actual} g faltan</Text>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default MacroCard;
