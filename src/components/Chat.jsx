import { Button, Card, Input, List, Space, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;


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
    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>

                
                <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Card style={{ flex: 1, textAlign: 'center' }}>
                        <Text strong>Esperando que el profesional acepte la solicitud</Text>
                    </Card>
                    <Button danger>Cancelar</Button>
                </Space>

                
                <Card>
                    <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '1rem' }}>
                        <List
                            dataSource={messages}
                            renderItem={(item) => (
                                <List.Item style={{ display: 'block' }}>
                                    <Text strong>{item.author}:</Text>
                                    <div>{item.content}</div>
                                    <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                                        {item.timestamp}
                                    </Text>
                                </List.Item>
                            )}
                        />
                    </div>

                    
                    <TextArea rows={4} placeholder="Escribe tu mensaje aquí..." />
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                        <Button type="primary">Enviar</Button>
                    </div>
                </Card>
            </Space>
        </div>
    );
}