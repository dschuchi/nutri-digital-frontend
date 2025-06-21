import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Flex, Select, Space, message } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [loadingPdf, setLoadingPdf] = useState(false);

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

  // Refs para cada gráfico (para capturar)
  const chartRefs = useMemo(() => charts.map(() => React.createRef()), [charts]);

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

  // Descargar todos los gráficos en PDF, 2 por página con título
  const handleDownloadPDF = async () => {
    setLoadingPdf(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth(); // ~595px
      const pageHeight = pdf.internal.pageSize.getHeight(); // ~842px

      const margin = 20;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = (pageHeight - margin * 3) / 2; // Altura por gráfico (2 por página)

      for (let i = 0; i < charts.length; i += 2) {
        if (i > 0) pdf.addPage();

        for (let j = 0; j < 2; j++) {
          const chartIndex = i + j;
          if (chartIndex >= charts.length) break;

          const ref = chartRefs[chartIndex];
          if (!ref.current) continue;

          // Título del gráfico
          const title = charts[chartIndex].title;

          // Renderizar canvas del gráfico
          const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/png');

          // Calcular dimensiones para mantener aspect ratio
          const imgProps = {
            width: canvas.width,
            height: canvas.height,
          };
          const imgWidth = usableWidth;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          // Posiciones
          const x = margin;
          const y = margin + j * (usableHeight + margin);

          // Dibujar título
          pdf.setFontSize(16);
          pdf.text(title, x, y);

          // Dibujar imagen debajo del título (dejamos 20px de margen para el título)
          pdf.addImage(imgData, 'PNG', x, y + 10, imgWidth, imgHeight);
        }
      }

      pdf.save('reportes.pdf');
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPdf(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      {contextHolder}
      <Flex justify="space-between" style={{ marginBottom: 16 }}>
        <Select
          size="large"
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

        <Flex justify='space-between'>
          <Space>
            <Button size="large" hidden={isProfessional()} disabled={disableButton()} onClick={handleShareReport}>
              Compartir informe a mi profesional
            </Button>

            <Button size="large" type="primary" onClick={handleDownloadPDF} loading={loadingPdf}>
              Descargar reporte
            </Button>
          </Space>
        </Flex>
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

      {/* Gráficos ocultos para generar PDF */}
      <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
        {charts.map((chart, index) => (
          <div key={chart.key} ref={chartRefs[index]} style={{ width: 800, height: 400 }}>
            <BarChartWithGoal
              data={chart.data}
              dataKey={chart.dataKey}
              label={chart.label}
              color={chart.color}
              goal={chart.goal}
              yUnit={chart.yUnit}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Reports;
