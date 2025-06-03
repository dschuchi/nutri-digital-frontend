import { Card, Col, Progress, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ComparacionObjetivos({ paciente }) {
  const { resumen, objetivosNutricionales, objetivoEjercicio, historialEjercicio } = paciente;

  const ejercicioReal = historialEjercicio?.reduce(
    (total, ej) => total + (ej.caloriasQuemadas || 0),
    0
  );

  return (
    <>
      <Title level={4}>Comparación de objetivos vs resultados</Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Nutrición (calorías)">
            <Text>Consumidas: {resumen?.caloriasConsumidas} kcal</Text><br />
            <Text>Objetivo: {objetivosNutricionales?.calories} kcal</Text>
            <Progress
              percent={Math.min(
                (resumen.caloriasConsumidas / objetivosNutricionales.calories) * 100,
                100
              )}
              status={resumen.caloriasConsumidas > objetivosNutricionales.calories ? 'exception' : 'normal'}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Ejercicio (calorías)">
            <Text>Quemadas: {ejercicioReal} kcal</Text><br />
            <Text>Objetivo: {objetivoEjercicio?.calories_burned_goal} kcal</Text>
            <Progress
              percent={Math.min(
                (ejercicioReal / objetivoEjercicio.calories_burned_goal) * 100,
                100
              )}
              status={ejercicioReal < objetivoEjercicio.calories_burned_goal ? 'active' : 'success'}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
