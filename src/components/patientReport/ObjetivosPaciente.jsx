import { Card, Col, Row, Typography } from 'antd';
import ComparacionObjetivos from './ComparacionObjetivos';

const { Title, Text } = Typography;

export default function ObjetivosPaciente({ paciente }) {
  const nutricion = paciente?.objetivosNutricionales;
  const ejercicio = paciente?.objetivoEjercicio;

  if (!nutricion && !ejercicio) return <p>No hay objetivos definidos para este paciente.</p>;

  return (
    <>
      <Title level={4}>Objetivos del paciente</Title>
      <Row gutter={16}>
        {nutricion && (
          <Col span={12}>
            <Card title="Nutrición">
              <ul style={{ marginBottom: 0 }}>
                <li>Calorías: {nutricion.calories} cal</li>
                <li>Proteínas: {nutricion.protein} g</li>
                <li>Grasas: {nutricion.total_fat} g</li>
                <li>Carbohidratos: {nutricion.total_carbs} g</li>
              </ul>
            </Card>
          </Col>
        )}

        {ejercicio && (
          <Col span={12}>
            <Card title="Ejercicio">
              <Text>Meta diaria: {ejercicio.calories_burned_goal} cal quemadas</Text>
            </Card>
          </Col>
        )}
      </Row>
        {paciente.resumen && (
            <div style={{ marginTop: 24 }}>
                <ComparacionObjetivos paciente={paciente} />
            </div>
        )}
    </>
  );
}
