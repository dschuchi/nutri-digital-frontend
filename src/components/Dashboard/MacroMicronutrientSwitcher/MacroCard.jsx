import { Card, Col, Row, Typography, Progress } from 'antd';

const { Title, Text } = Typography;

const coloresNormales = {
  carbohidratos: '#1890ff', // azul
  grasas: '#fa8c16',         // naranja
  proteinas: '#52c41a',      // verde
};

const colorExceso = '#ff4d4f';

const MacroCard = ({ data }) => {
  return (
    <Card style={{ padding: '12px 16px', borderRadius: 12 }}>
      <Title level={4}>Macronutrientes</Title>
      <Row justify="space-around">
        {Object.entries(data).map(([key, val]) => {
          const nombre = key.charAt(0).toUpperCase() + key.slice(1);
          const actual = val.actual || 0;
          const objetivo = val.objetivo;

          const sinObjetivo = objetivo == null || objetivo === 0;
          const excedido = !sinObjetivo && actual > objetivo;
          const faltan = !sinObjetivo && !excedido;

          const color = excedido
            ? colorExceso
            : coloresNormales[key.toLowerCase()] || '#999';

          const porcentaje = sinObjetivo
            ? 100
            : Math.min((actual / objetivo) * 100, 100);

          return (
            <Col key={key} style={{ textAlign: 'center' }}>
              <Text strong>{nombre}</Text><br />
              <Progress
                type="circle"
                percent={Math.round(porcentaje)}
                width={70}
                format={() => `${actual}g`}
                strokeColor={color}
              />
              <div style={{ marginTop: 4 }}>
                {faltan && (
                  <Text style={{ fontSize: 12 }} type="secondary">
                    falta {objetivo - actual} %
                  </Text>
                )}
                {excedido && (
                  <Text style={{ fontSize: 12 }} type="danger">
                    {actual - objetivo} % excedido
                  </Text>
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default MacroCard;
