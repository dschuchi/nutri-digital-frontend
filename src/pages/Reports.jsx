import { Button, Card, Flex, Select, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getReport } from '../api/report';
import { useAuth } from '../context/AuthContext';
import BarChartWithGoal from '../components/reports/BarChartWithGoal';
import dayjs from 'dayjs';
import { getMacroNutrientGoals } from '../api/nutrientGoals';
import { getExerciseGoals } from '../api/exerciseGoals';
import { getMyProfessional } from '../api/patient';
import { sendMessage } from '../api/messages';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const userParam = searchParams.get('id_user')
  const idUser = userParam || user.id

  const [foodConsumed, setFoodConsumed] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [caloriesBurnedData, setCaloriesBurnedData] = useState([]);
  const [macroGoals, setMacroGoals] = useState()
  const [burnedGoal, setBurnedGoal] = useState()
  const [waterGoal, setWaterGoal] = useState(2000)
  const [isLoading, setIsLoading] = useState(true);
  const [myProfessionalId, setMyProfessionalId] = useState(null)
  const [messageApi, contextHolder] = message.useMessage();
  const [chartKey, setChartKey] = useState('calories');

  const charts = useMemo(
    () => [
      {
        key: 'calories',
        title: 'Calorías',
        data: foodConsumed,
        dataKey: 'calories',
        label: 'Calorías',
        color: '#82ca9d',
        goal: macroGoals?.calories,
        yUnit: 'cal',
      },
      {
        key: 'protein',
        title: 'Proteínas',
        data: foodConsumed,
        dataKey: 'protein',
        label: 'Proteínas',
        color: '#8884d8',
        goal: macroGoals?.protein,
        yUnit: 'g',
      },
      {
        key: 'fat',
        title: 'Grasas',
        data: foodConsumed,
        dataKey: 'total_fat',
        label: 'Grasas',
        color: '#ff7300',
        goal: macroGoals?.total_fat,
        yUnit: 'g',
      },
      {
        key: 'carbs',
        title: 'Carbohidratos',
        data: foodConsumed,
        dataKey: 'total_carbs',
        label: 'Carbohidratos',
        color: '#ffc658',
        goal: macroGoals?.total_carbs,
        yUnit: 'g',
      },
      {
        key: 'water',
        title: 'Agua consumida (ml)',
        data: waterData,
        dataKey: 'mililiters',
        label: 'Agua',
        color: '#00bcd4',
        goal: waterGoal,
        yUnit: 'ml',
      },
      {
        key: 'burned',
        title: 'Calorías quemadas',
        data: caloriesBurnedData,
        dataKey: 'calories',
        label: 'Calorías quemadas',
        color: '#d884d8',
        goal: burnedGoal?.calories_burned_goal,
        yUnit: 'cal',
      },
    ],
    [foodConsumed, waterData, caloriesBurnedData, macroGoals, waterGoal, burnedGoal]
  );

  const selectedChart = charts.find((c) => c.key === chartKey);

  useEffect(() => {
    Promise.all([
      getReport(idUser),
      getMacroNutrientGoals(idUser),
      getExerciseGoals(idUser),
      getMyProfessional(idUser)
    ])
      .then(([reportRes, macroGoalsRes, burnedGoalRes, myProfRes]) => {
        const data = reportRes.data;

        setFoodConsumed(buildNutritionData(data.foodConsumed || []));
        setWaterData(buildSimpleData(data.water || [], 'mililiters', 'mililiters'));
        setCaloriesBurnedData(buildSimpleData(data.caloriesBurned || [], 'calories', 'calories_burned'));

        setMacroGoals(macroGoalsRes.data[0]);
        setBurnedGoal(burnedGoalRes.data[0]);

        if (myProfRes.data?.length > 0) {
          setMyProfessionalId(myProfRes.data[0]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  function handleShareReport() {
    sendMessage(myProfessionalId.id, `Te comparto mi <a href='http://localhost:5173/reportes?id_user=${idUser}'>informe</a>`)
      .then(() => {
        messageApi.success('Informe enviado')
      })
      .catch(console.error);
  }

  function disableButton() {
    return userParam != null || myProfessionalId == null;
  }

  function isProfessional() {
    return userParam != null
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {contextHolder}
      <Flex justify='space-between'>
        <Select
          size='large'
          value={chartKey}
          onChange={setChartKey}
          style={{ width: 260, marginBottom: 24 }}
          placeholder="Selecciona un gráfico"
        >
          {charts.map(({ key, title }) => (
            <Select.Option key={key} value={key}>
              {title}
            </Select.Option>
          ))}
        </Select>
        <Button size='large' hidden={isProfessional()} disabled={disableButton()} onClick={handleShareReport}>
          Compartir informe a mi profesional
        </Button>
      </Flex>

      <Card>
        <div style={{ height: '60vh' }}>
          <BarChartWithGoal
            data={selectedChart.data}
            dataKey={selectedChart.dataKey}
            label={selectedChart.label}
            color={selectedChart.color}
            goal={selectedChart.goal}
            yUnit={selectedChart.yUnit}
          />
        </div>
      </Card>
    </>
  );
};

export default Reports;
