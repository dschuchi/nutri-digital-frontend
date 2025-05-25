import { Button, Card, Input, List, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getRequestClient } from '../../api/requestProfessional';
import { useAuth } from '../../context/AuthContext';
import { getMyProfessional } from '../../api/patient';

const messages = [
    {
        author: 'Carlos',
        content: 'Hola, ya vi tu solicitud.',
        timestamp: 'Hace 2 minutos',
    },
    {
        author: 'Tú',
        content: 'Gracias, estaré atento.',
        timestamp: 'Hace 1 minuto',
    },
];

export function Chat() {
    const [active, setActive] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        getMyProfessional(user.id)
            .then((res) => {
                if (res && res.data.length > 0) {
                    setActive(true);
                }
            })
            .catch((error) => {
                console.error('Error fetching professional data:', error);
            });
    }, []);

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Card hidden={active} size='small'>
                        <Typography.Text>Esperando que el profesional acepte la solicitud</Typography.Text>
                    </Card>
                    <Button danger>Cancelar</Button>
                </Space>

                <Card>
                    <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '1rem' }}>
                        <List
                            dataSource={messages}
                            renderItem={(item) => (
                                <List.Item style={{ display: 'block' }}>
                                    <Typography.Text strong>{item.author}:</Typography.Text>
                                    <div>{item.content}</div>
                                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        {item.timestamp}
                                    </Typography.Text>
                                </List.Item>
                            )}
                        />
                    </div>

                    <Input.TextArea disabled={!active} rows={4} placeholder="Escribe tu mensaje aquí..." />
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <Button type="primary">Enviar</Button>
                    </div>
                </Card>
            </Space>
        </div>
    );
}