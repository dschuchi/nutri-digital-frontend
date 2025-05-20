import { useEffect, useState } from 'react';
import { getPanelData } from '../../api/progressPanel';
import { getHydrationHistory } from '../../api/hydration';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [agua, setAgua] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPanelData();
        setData(response.data);

        const today = new Date().toISOString().split('T')[0];
        const hydrationRes = await getHydrationHistory(today);
        const totalAgua = Array.isArray(hydrationRes.data)
          ? hydrationRes.data.reduce((sum, item) => sum + (item.amount || 0), 0)
          : 0;
        setAgua(totalAgua);
      } catch (err) {
        console.error('Error al obtener datos del panel o hidratación', err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div>Cargando...</div>;

  return <DashboardContent data={data} agua={agua} />;
};

export default Dashboard;
