import { Typography } from 'antd';
import MealPlanner from '../components/MealPlanner';

const { Title } = Typography;

const MealPlanningPage = () => {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem' }}>
      <Title level={2}>Planificador de Comidas</Title>
      <MealPlanner />
    </div>
  );
};

export default MealPlanningPage;
