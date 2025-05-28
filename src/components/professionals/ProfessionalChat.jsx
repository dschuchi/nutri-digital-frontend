// pages/ProfessionalChat.jsx
import { useEffect, useState } from 'react';
import { getMyPatients } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Layout, Menu, Typography, Empty } from 'antd';

const { Sider, Content } = Layout;

export function ProfessionalChat() {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    useEffect(() => {
        getMyPatients(user.id)
            .then(res => {
                console.log("Respuesta getMyPatients:", res.data);
                setPatients(res.data || []);
                if (res.data.length > 0) {
                    setSelectedPatientId(res.data[0].id);
                }
            })
            .catch(err => {
                console.error("Error al obtener pacientes:", err);
            });
    }, [user.id]);

    return (
        <Layout style={{ minHeight: '80vh', border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <Sider width={250} style={{ background: '#fff', padding: '16px' }}>
                <Typography.Title level={4}>Pacientes</Typography.Title>
                {patients.length === 0 ? (
                    <Empty description="No tienes pacientes asignados" />
                ) : (
                    <Menu
                        mode="inline"
                        selectedKeys={[String(selectedPatientId)]}
                        onClick={({ key }) => setSelectedPatientId(parseInt(key))}
                    >
                        {patients.map((p) => (
                            <Menu.Item key={p.id}>
                                {p.name} {p.lastname}
                            </Menu.Item>
                        ))}
                    </Menu>
                )}
            </Sider>

            <Content style={{ padding: '16px' }}>
                {selectedPatientId ? (
                    <Chat targetUserId={selectedPatientId} />
                ) : (
                    <Typography.Text>Seleccioná un paciente para comenzar a chatear.</Typography.Text>
                )}
            </Content>
        </Layout>
    );
}
