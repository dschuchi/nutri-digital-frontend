import { useEffect, useState } from 'react';
import { getPanelData } from '../../api/progressPanel';
import { getHydrationHistory } from '../../api/hydration';
import DashboardContent from './DashboardContent';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [agua, setAgua] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { user } = useAuth()

  const fetchData = async (date) => {
    try {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const response = await getPanelData(formattedDate, user.id);
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

  const handleChangeDay = (delta) => {
    const newDate = dayjs(selectedDate).add(delta, 'day').toDate();
    setSelectedDate(newDate);
  };

  if (!data) return <div>Cargando...</div>;

  return (
    <div>
      <DashboardContent
        data={data}
        agua={agua}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onChangeDay={handleChangeDay}
      />
    </div>
  );
};

export default Dashboard;