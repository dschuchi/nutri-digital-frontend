import { Card, Col, Row, Progress, Typography } from 'antd';

const { Text } = Typography;

export default function ResumenProgreso({ paciente }) {
  if (!paciente?.resumen) return null;

  const {
    caloriasConsumidas,
    caloriasObjetivo,
    ejercicioTotalMinutos,
    objetivosCumplidos,
    totalObjetivos,
  } = paciente.resumen;

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Calorías (nutrición)">
            <Text>Consumidas: {caloriasConsumidas} kcal</Text><br />
            <Text>Objetivo: {caloriasObjetivo} kcal</Text>
            <Progress
              percent={Math.min((caloriasConsumidas / caloriasObjetivo) * 100, 100)}
              status={caloriasConsumidas > caloriasObjetivo ? 'exception' : 'normal'}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Actividad física">
            <Text>Total minutos: {ejercicioTotalMinutos}</Text>
            <Progress
              percent={Math.min((ejercicioTotalMinutos / 60) * 100, 100)}
              showInfo={false}
              status="active"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Cumplimiento de objetivos">
            <Text>{objetivosCumplidos} de {totalObjetivos} cumplidos</Text>
            <Progress
              percent={(objetivosCumplidos / totalObjetivos) * 100}
              status="active"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
