import { useEffect, useState } from 'react';
import { Layout, Card, Typography, Tabs } from 'antd';
import PatientSelector from '../components/patientReport/PatientSelector';
import PatientReportContent from '../components/patientReport/PatientReportContent';
import { mockPatients } from '../mocks/mockPatients';
import HistorialNutricion from '../components/patientReport/HistorialNutricion';
import HistorialEjercicio from '../components/patientReport/HistorialEjercicio';
import ObjetivosPaciente from '../components/patientReport/ObjetivosPaciente';
import { useSearchParams } from 'react-router-dom';



const { Sider, Content } = Layout;
const { Title } = Typography;

export default function PatientReport() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('resumen');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const targetId = searchParams.get('target');
    const encontrado = mockPatients.find(p => String(p.id) === targetId);

    if (encontrado) {
      setSelectedPatient(encontrado);
    } else if (mockPatients.length > 0) {
      setSelectedPatient(mockPatients[0]);
    }
  }, [searchParams]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={260} style={{ backgroundColor: '#fff', padding: '16px 0' }}>
        <PatientSelector
          patients={mockPatients}
          selectedPatientId={selectedPatient?.id}
          onSelect={setSelectedPatient}
        />
      </Sider>

      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        {selectedPatient ? (
          <>
            <Title level={3} style={{ marginBottom: 12 }}>
                Informe de {selectedPatient.name}
            </Title>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'resumen', label: 'Resumen General' },
                { key: 'nutricion', label: 'Historial de Nutrición' },
                { key: 'ejercicio', label: 'Historial de Ejercicio' },
                { key: 'objetivos', label: 'Objetivos' },
              ]}
            />

            {activeTab === 'resumen' && (
                <PatientReportContent paciente={selectedPatient} date={'2025-05-24'} />
            )}

            {activeTab === 'nutricion' && (
                <HistorialNutricion paciente={selectedPatient} />
            )}

            {activeTab === 'ejercicio' && (
                <HistorialEjercicio paciente={selectedPatient} />
            )}

            {activeTab === 'objetivos' && (
                <ObjetivosPaciente paciente={selectedPatient} />
            )}

          </>
        ) : (
          <Title level={4}>Seleccione un paciente para ver su informe</Title>
        )}
      </Content>
    </Layout>
  );
}
