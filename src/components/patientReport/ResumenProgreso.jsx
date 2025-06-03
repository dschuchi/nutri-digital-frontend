import { Card, Col, Row, Progress, Typography } from 'antd';

const { Text } = Typography;

export default function ResumenProgreso({ paciente }) {
  if (!paciente?.resumen) return null;

  const {
    caloriasConsumidas,
    caloriasObjetivo,
    caloriasEjercicio,
    objetivosCumplidos,
    totalObjetivos,
  } = paciente.resumen;

  return (
    <Row gutter={[0, 16]} direction="vertical">
      <Col span={24}>
        <Card title="Calorías (nutrición)">
          <Text>Consumidas: {caloriasConsumidas} cal</Text><br />
          <Text>Objetivo: {caloriasObjetivo} cal</Text>
          <Progress
            percent={parseFloat(
              (caloriasConsumidas / caloriasObjetivo) * 100
            ).toFixed(2)}
            status={caloriasConsumidas > caloriasObjetivo ? 'exception' : 'normal'}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Ejercicio (calorías)">
          <Text>Total calorías quemadas: {caloriasEjercicio} cal</Text><br />
          <Text>Objetivo: {paciente.objetivoEjercicio?.calories_burned_goal} cal</Text>
          <Progress
            percent={parseFloat(
              (caloriasEjercicio / paciente.objetivoEjercicio?.calories_burned_goal) * 100
            ).toFixed(2)}
            status="active"
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Cumplimiento de objetivos">
          <Text>{objetivosCumplidos} de {totalObjetivos} cumplidos</Text>
          <Progress
            percent={parseFloat(
              (objetivosCumplidos / totalObjetivos) * 100
            ).toFixed(2)}
            status="active"
          />
        </Card>
      </Col>
    </Row>
  );
}
