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

      <Row gutter={[0, 16]} direction="vertical">
        <Col span={24}>
          <Card title="Nutrición (calorías)">
            <Text>Consumidas: {resumen?.caloriasConsumidas} cal</Text><br />
            <Text>Objetivo: {objetivosNutricionales?.calories} cal</Text>
            <Progress
              percent={parseFloat(
                (resumen.caloriasConsumidas / objetivosNutricionales.calories) * 100
              ).toFixed(2)}
              status={
                resumen.caloriasConsumidas > objetivosNutricionales.calories
                  ? 'exception'
                  : 'normal'
              }
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Ejercicio (calorías)">
            <Text>Quemadas: {ejercicioReal} cal</Text><br />
            <Text>Objetivo: {objetivoEjercicio?.calories_burned_goal} cal</Text>
            <Progress
              percent={parseFloat(
                (ejercicioReal / objetivoEjercicio.calories_burned_goal) * 100
              ).toFixed(2)}
              status={
                ejercicioReal < objetivoEjercicio.calories_burned_goal
                  ? 'active'
                  : 'success'
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
