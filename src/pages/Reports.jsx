import { Card, Space } from 'antd';
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
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Calorías quemadas">
        <BarChartWithGoal
          data={caloriesData}
          dataKey="calories"
          label="Calorías"
          color="#82ca9d"
          goal={2000}
          yUnit="Calorías"
        />
      </Card>

      <Card title="Agua consumida (ml)">
        <BarChartWithGoal
          data={waterData}
          dataKey="mililiters"
          label="Agua"
          color="#8884d8"
          goal={2000}
          yUnit="Mililitros"
        />
      </Card>
    </Space>
  );
};

export default Reports;
