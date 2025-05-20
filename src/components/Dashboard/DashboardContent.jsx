import { Row, Col, Typography } from 'antd';
import CalorieCard from './CalorieCard';
import WaterProgressCard from './WaterProgressCard';
import HealthyHeartCard from './HealthyHeartCard';
import LowCarbCard from './LowCarbCard';
import SummaryCard from './SummaryCard';
import MacroMicronutrientSwitcher from './MacroMicronutrientSwitcher/MacroMicronutrientSwitcher';

const { Title } = Typography;

const DashboardContent = ({ data, agua, objetivoAgua = 2000 }) => {
  const safe = (v) => (v == null ? 0 : v);
  const { consumed, goals } = data;

  const calorias = {
    objetivo: safe(goals.calories),
    alimentos: safe(consumed.calories),
    ejercicio: 0
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
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}><CalorieCard {...calorias} /></Col>
        <Col xs={24} md={12}><WaterProgressCard consumoActual={agua} consumoObjetivo={objetivoAgua} /></Col>

        <Col xs={24}>
          <MacroMicronutrientSwitcher macros={macronutrientes} micros={{ ...consumed, goals }} />
        </Col>

        <Col xs={24} md={8}><HealthyHeartCard data={corazonSaludable} /></Col>
        <Col xs={24} md={8}><LowCarbCard data={bajosCarbohidratos} /></Col>
        <Col xs={24} md={8}><SummaryCard data={resumen} /></Col>
      </Row>
    </div>
  );
};

export default DashboardContent;