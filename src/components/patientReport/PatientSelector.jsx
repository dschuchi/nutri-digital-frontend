import { List, Typography } from 'antd';

export default function PatientSelector({ patients, selectedPatientId, onSelect }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Typography.Title level={5} style={{ padding: '0 16px', marginTop: 0 }}>
        Pacientes
      </Typography.Title>

      <List
        dataSource={patients}
        renderItem={(patient) => (
          <List.Item
            onClick={() => onSelect(patient)}
            style={{
              cursor: 'pointer',
              paddingLeft: 16,
              backgroundColor: patient.id === selectedPatientId ? '#e6f7ff' : 'transparent',
            }}
          >
            {patient.name}
          </List.Item>
        )}
      />
    </div>
  );
}
