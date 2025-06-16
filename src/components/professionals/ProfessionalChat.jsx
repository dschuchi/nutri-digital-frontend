import { useEffect, useState } from 'react';
import { getMyPatients } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Layout, Menu, Typography, Empty } from 'antd';

const { Sider, Content } = Layout;

export function ProfessionalChat({ forcedTargetId }) {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    useEffect(() => {
        getMyPatients(user.id)
            .then(res => {
                const list = res.data || [];
                setPatients(list);
                if (list.length > 0) {
                    const id = forcedTargetId || list[0].id;
                    setSelectedPatientId(id);
                }
            })
            .catch(console.error);
    }, [user.id, forcedTargetId]);

    return (
        <Layout>
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
                    <Chat targetUserId={selectedPatientId} isProfessional={true} />
                ) : (
                    <Typography.Text>Seleccioná un paciente para comenzar a chatear.</Typography.Text>
                )}
            </Content>
        </Layout>
    );
}
