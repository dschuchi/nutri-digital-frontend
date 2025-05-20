import { useEffect, useState } from 'react';
import { getPanelData } from '../../api/progressPanel';
import { getHydrationHistory } from '../../api/hydration';
import DashboardContent from './DashboardContent';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [agua, setAgua] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = async (date) => {
    try {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        const response = await getPanelData(formattedDate);
        setData(response.data);

        const hydrationRes = await getHydrationHistory(formattedDate);
        const totalAgua = Array.isArray(hydrationRes.data)
        ? hydrationRes.data.reduce((sum, item) => sum + (item.mililiters || 0), 0)
        : 0;
        setAgua(totalAgua);
    } catch (err) {
        console.error('Error al obtener datos del panel o hidratación', err);
    }
  };


  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  if (!data) return <div>Cargando...</div>;

  return (
    <>
      <div style={{ padding: '16px 24px' }}>
        <DatePicker
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={(date) => setSelectedDate(date?.toDate() || new Date())}
          style={{ marginBottom: 16 }}
        />
      </div>
      <DashboardContent data={data} agua={agua} />
    </>
  );
};

export default Dashboard;
