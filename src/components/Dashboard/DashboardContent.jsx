import { Row, Col, Typography, DatePicker, Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import CalorieCard from './CalorieCard';
import WaterGlassCard from './WaterGlassCard/WaterGlassCard';
import HealthyHeartCard from './HealthyHeartCard';
import LowCarbCard from './LowCarbCard';
import SummaryCard from './SummaryCard';
import MacroMicronutrientSwitcher from './MacroMicronutrientSwitcher/MacroMicronutrientSwitcher';

const { Title } = Typography;

const DashboardContent = ({ data, agua, objetivoAgua = 2000, selectedDate, onDateChange, onChangeDay }) => {
  const safe = (v) => (v == null ? 0 : v);
  const { consumed, goals, caloriesLost } = data;

  const calorias = {
    objetivo: safe(goals.calories),
    alimentos: safe(consumed.calories),
    ejercicio: caloriesLost
  };

  const macronutrientes = {
    carbohidratos: { actual: safe(consumed.total_carbs), objetivo: safe(goals.total_carbs) },
    grasas: { actual: safe(consumed.total_fat), objetivo: safe(goals.total_fat) },
    proteinas: { actual: safe(consumed.protein), objetivo: safe(goals.protein) }
  };

  const corazonSaludable = {
    grasas: { actual: safe(consumed.total_fat), max: safe(goals.total_fat) },
    sodio: { actual: safe(consumed.sodium), max: safe(goals.sodium) },
    colesterol: { actual: safe(consumed.cholesterol), max: safe(goals.cholesterol) }
  };

  const bajosCarbohidratos = {
    netos: { actual: safe(consumed.total_carbs), max: safe(goals.total_carbs) },
    azucar: { actual: safe(consumed.sugar), max: safe(goals.sugar) },
    fibra: { actual: safe(consumed.fiber), max: safe(goals.fiber) }
  };

  const resumen = {
    carbohidratos: { actual: safe(consumed.total_carbs), objetivo: safe(goals.total_carbs) },
    grasas: { actual: safe(consumed.total_fat), objetivo: safe(goals.total_fat) },
    proteinas: { actual: safe(consumed.protein), objetivo: safe(goals.protein) }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Resumen diario</Title>
        </Col>
        <Col>
          <Row align="middle" gutter={8}>
            <Col>
              <Tooltip title="Día anterior">
                <Button type="text" icon={<LeftOutlined />} onClick={() => onChangeDay(-1)} />
              </Tooltip>
            </Col>
            <Col>
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(date) => onDateChange(date?.toDate() || new Date())}
                style={{ height: 40, borderRadius: 8, padding: '0 12px' }}
              />
            </Col>
            <Col>
              <Tooltip title="Día siguiente">
                <Button type="text" icon={<RightOutlined />} onClick={() => onChangeDay(1)} />
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 8]}>
        <Col xs={24} md={18}>
          <CalorieCard {...calorias} />
        </Col>
        <Col xs={24} md={6}>
          <WaterGlassCard consumoActual={agua} consumoObjetivo={objetivoAgua} />
        </Col>
      </Row>

      <Row gutter={[16, 8]} style={{ marginTop: 8 }}>
        <Col xs={24}>
          <MacroMicronutrientSwitcher macros={macronutrientes} micros={{ ...consumed, goals }} />
        </Col>
      </Row>

      <Row gutter={[16, 8]} style={{ marginTop: 4 }}>
        <Col xs={24} md={8}><HealthyHeartCard data={corazonSaludable} /></Col>
        <Col xs={24} md={8}><LowCarbCard data={bajosCarbohidratos} /></Col>
        <Col xs={24} md={8}>
          <SummaryCard data={Object.fromEntries(
            Object.entries(consumed).map(([key, val]) => [
              key,
              { actual: safe(val), objetivo: safe(goals[key]) }
            ])
          )} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;