import { useEffect, useState } from 'react';
import { Layout, Typography, Tabs, DatePicker, Spin, message, Flex, Space } from 'antd';
import PatientSelector from '../components/patientReport/PatientSelector';
import PatientReportContent from '../components/patientReport/PatientReportContent';
import HistorialNutricion from '../components/patientReport/HistorialNutricion';
import HistorialEjercicio from '../components/patientReport/HistorialEjercicio';
import ObjetivosPaciente from '../components/patientReport/ObjetivosPaciente';
import { useSearchParams } from 'react-router-dom';
import { getPatientData } from '../data/getPatientData';
import { getMyPatients } from '../api/patient';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;
const { Title } = Typography;

export default function PatientReport() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('resumen');
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [dateFrom, setDateFrom] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const { user } = useAuth(); // obtenemos el profesional logueado

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const patientsRes = await getMyPatients(user.id);
        const rawPatients = patientsRes.data || [];

        const date = selectedDate.format('YYYY-MM-DD');
        const dateFromFormatted = dateFrom.format('YYYY-MM-DD');
        const enrichedPatients = await Promise.all(
          rawPatients.map(p =>
            getPatientData(p.id, date, `${p.name} ${p.lastname}`, dateFromFormatted)
          )
        );

        setPatients(enrichedPatients);

        const targetId = parseInt(searchParams.get('target'));
        const seleccionado = enrichedPatients.find(p => p.id === targetId) || enrichedPatients[0];
        setSelectedPatient(seleccionado);
      } catch (err) {
        console.error(err);
        message.error('Error al cargar los pacientes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, searchParams, selectedDate, dateFrom]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={260} style={{ backgroundColor: '#fff', padding: '16px 0' }}>
        <PatientSelector
          patients={patients}
          selectedPatientId={selectedPatient?.id}
          onSelect={setSelectedPatient}
        />
      </Sider>

      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>
            {selectedPatient ? `Informe de ${selectedPatient.name}` : 'Informe del paciente'}
          </Title>
          <Flex justify='flex-end'>
            <Space>
              <Typography.Text strong>
                Desde
              </Typography.Text>
              <DatePicker disabled={activeTab == 'nutricion' || activeTab == 'ejercicio'} value={dateFrom} onChange={setDateFrom} allowClear={false} maxDate={selectedDate} />
              <Typography.Text strong>
                Hasta
              </Typography.Text>
              <DatePicker value={selectedDate} onChange={setSelectedDate} allowClear={false} />
            </Space>
          </Flex>
        </div>

        {loading ? (
          <Spin size="large" />
        ) : selectedPatient ? (
          <>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'resumen', label: 'Resumen General' },
                { key: 'objetivos', label: 'Objetivos' },
                { key: 'nutricion', label: 'Historial de Nutrición' },
                { key: 'ejercicio', label: 'Historial de Ejercicio' },
              ]}
            />

            {activeTab === 'resumen' && (
              <PatientReportContent paciente={selectedPatient} date={selectedDate.format('YYYY-MM-DD')} />
            )}
            {activeTab === 'nutricion' && <HistorialNutricion paciente={selectedPatient} />}
            {activeTab === 'ejercicio' && <HistorialEjercicio paciente={selectedPatient} />}
            {activeTab === 'objetivos' && <ObjetivosPaciente paciente={selectedPatient} />}
          </>
        ) : (
          <Title level={4}>Seleccione un paciente para ver su informe</Title>
        )}
      </Content>
    </Layout>
  );
}
