import { Card, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getReport } from '../api/report';
import { useAuth } from '../context/AuthContext';
import BarChartWithGoal from '../components/reports/BarChartWithGoal';
import dayjs from 'dayjs';
import { getMacroNutrientGoals } from '../api/nutrientGoals';
import { getExerciseGoals } from '../api/exerciseGoals';

function buildSimpleData(dataArray, keyName, valueName) {
  const daysInMonth = Array.from({ length: 30 }, (_, i) =>
    dayjs().startOf('month').add(i, 'day').format('YYYY-MM-DD')
  );

  return daysInMonth.map((date) => {
    const match = dataArray.find((d) => dayjs(d.date).format('YYYY-MM-DD') === date);
    return {
      date,
      [keyName]: match ? parseInt(match[valueName] || '0', 10) : 0,
    };
  });
}


function buildNutritionData(foodConsumed) {
  const daysInMonth = Array.from({ length: 30 }, (_, i) =>
    dayjs().startOf('month').add(i, 'day').format('YYYY-MM-DD')
  );

  return daysInMonth.map((date) => {
    const match = foodConsumed.find((d) => dayjs(d.date).format('YYYY-MM-DD') === date);

    return {
      date,
      calories: match ? parseInt(match.calories || '0', 10) : 0,
      total_carbs: match ? parseInt(match.total_carbs || '0', 10) : 0,
      total_fat: match ? parseInt(match.total_fat || '0', 10) : 0,
      protein: match ? parseInt(match.protein || '0', 10) : 0,
    };
  });
}

const Reports = () => {
  const { user } = useAuth();
  const [foodConsumed, setFoodConsumed] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [caloriesBurnedData, setCaloriesBurnedData] = useState([]);
  const [macroGoals, setMacroGoals] = useState()
  const [burnedGoal, setBurnedGoal] = useState()
  const [waterGoal, setWaterGoal] = useState(2000)
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    Promise.all([
      getReport(user.id),
      getMacroNutrientGoals(user.id),
      getExerciseGoals(user.id)
    ])
      .then(([reportRes, macroGoalsRes, burnedGoalRes]) => {
        const data = reportRes.data;

        setFoodConsumed(buildNutritionData(data.foodConsumed || []));
        setWaterData(buildSimpleData(data.water || [], 'mililiters', 'mililiters'));
        setCaloriesBurnedData(buildSimpleData(data.caloriesBurned || [], 'calories', 'calories_burned'));

        setMacroGoals(macroGoalsRes.data[0]);
        setBurnedGoal(burnedGoalRes.data[0]);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>; // O un spinner si usás algún componente de UI
  }


  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Calorías">
          <BarChartWithGoal
            data={foodConsumed}
            dataKey="calories"
            label="Calorías"
            color="#82ca9d"
            goal={macroGoals.calories}
            yUnit="cal"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Proteínas">
          <BarChartWithGoal
            data={foodConsumed}
            dataKey="protein"
            label="Proteínas"
            color="#8884d8"
            goal={macroGoals.protein}
            yUnit="g"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Grasas">
          <BarChartWithGoal
            data={foodConsumed}
            dataKey="total_fat"
            label="Grasas"
            color="#ff7300"
            goal={macroGoals.total_fat}
            yUnit="g"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Carbohidratos">
          <BarChartWithGoal
            data={foodConsumed}
            dataKey="total_carbs"
            label="Carbohidratos"
            color="#ffc658"
            goal={macroGoals.total_carbs}
            yUnit="g"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Agua consumida (ml)">
          <BarChartWithGoal
            data={waterData}
            dataKey="mililiters"
            label="Agua"
            color="#00bcd4"
            goal={waterGoal}
            yUnit="ml"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Calorías quemadas">
          <BarChartWithGoal
            data={caloriesBurnedData}
            dataKey="calories"
            label="Calorías quemadas"
            color="#d884d8"
            goal={burnedGoal.calories_burned_goal}
            yUnit="cal"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Reports;
