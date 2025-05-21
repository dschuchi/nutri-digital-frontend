import { useEffect, useState } from 'react';
import { getPanelData } from '../../api/progressPanel';
import { getHydrationHistory } from '../../api/hydration';
import DashboardContent from './DashboardContent';
import { DatePicker, Typography, Row, Col } from 'antd';
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

  const { Title } = Typography;

  if (!data) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ padding: '16px 24px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>Resumen diario</Title>
          </Col>
          <Col>
            <DatePicker
              value={dayjs(selectedDate)}
              onChange={(date) => setSelectedDate(date?.toDate() || new Date())}
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}
            />
          </Col>
        </Row>
      </div>

      {/* El DashboardContent probablemente ya tenga su propio padding o grid */}
      <DashboardContent data={data} agua={agua} />
    </div>
  );
};

export default Dashboard;
