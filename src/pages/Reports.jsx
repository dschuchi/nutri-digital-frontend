import { Card, Col, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { getReport } from '../api/report';
import { useAuth } from '../context/AuthContext';
import BarChartWithGoal from '../components/reports/BarChartWithGoal';

const generateDaysOfMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(year, month, d);
    if (date.getMonth() !== month) break;
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

const mergeData = (days, reportData, key) => {
  const map = new Map(reportData.map(item => [item.date.split('T')[0], parseInt(item[key], 10)]));
  return days.map(date => ({
    date,
    [key]: map.get(date) ?? 0
  }));
};

const Reports = () => {
  const { user } = useAuth();
  const [caloriesData, setCaloriesData] = useState([]);
  const [waterData, setWaterData] = useState([]);

  useEffect(() => {
    getReport(user.id)
      .then((res) => {
        const days = generateDaysOfMonth();
        const calories = mergeData(days, res.data.caloriesBurned, 'mililiters').map(d => ({
          date: d.date,
          calories: d.mililiters
        }));
        const water = mergeData(days, res.data.water, 'mililiters');
        setCaloriesData(calories);
        setWaterData(water);
      })
      .catch(console.error);
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="Calorías">
          <BarChartWithGoal
            data={caloriesData}
            dataKey="calories"
            label="Calorías"
            color="#82ca9d"
            goal={2000}
            yUnit="Calorías"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Carbohidratos">
          <BarChartWithGoal
            data={caloriesData}
            dataKey="calories"
            label="Carbohidratos"
            color="#ffc658"
            goal={250}
            yUnit="g"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Grasas">
          <BarChartWithGoal
            data={caloriesData}
            dataKey="calories"
            label="Grasas"
            color="#ff7300"
            goal={70}
            yUnit="g"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Proteínas">
          <BarChartWithGoal
            data={caloriesData}
            dataKey="calories"
            label="Proteínas"
            color="#8884d8"
            goal={150}
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
            goal={2000}
            yUnit="ml"
          />
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Calorías quemadas">
          <BarChartWithGoal
            data={caloriesData}
            dataKey="calories"
            label="Calorías quemadas"
            color="#82ca9d"
            goal={2000}
            yUnit="Calorías"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Reports;
