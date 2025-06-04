import { Button, Card, Input, List, Space, Typography, message as antdMessage } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getMessages, sendMessage } from '../../api/messages';
import { getUser } from '../../api/user';
import { useAuth } from '../../context/AuthContext';

export function Chat({ targetUserId, isProfessional = false }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [targetName, setTargetName] = useState('');
    const { user } = useAuth();
    const scrollRef = useRef();

    useEffect(() => {
        if (!targetUserId) return;

        getUser(targetUserId)
            .then(res => {
                const { name, lastname } = res.data || {};
                setTargetName(`${name || ''} ${lastname || ''}`);
            })
            .catch(() => antdMessage.error('Error al cargar usuario'));

        getMessages(targetUserId)
            .then(res => {
                setMessages(res.data || []);
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            })
            .catch(() => antdMessage.error('Error al cargar mensajes.'));
    }, [targetUserId]);

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(targetUserId, text)
            .then(() => {
                setText('');
                fetchMessages();
            })
            .catch(() => antdMessage.error('Error al enviar mensaje'));
    };

    const handleNutritionGoal = () => {
        antdMessage.info("Abrir editor de objetivo nutricional");
    };

    const handleActivityGoal = () => {
        antdMessage.info("Abrir editor de objetivo físico");
    };

    const fetchMessages = () => {
        getMessages(targetUserId)
            .then(res => setMessages(res.data || []))
            .catch(() => antdMessage.error('Error al actualizar mensajes'));
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Text strong>
                        Conversación con {targetName || '...'}
                    </Typography.Text>
                    {isProfessional && (
                        <Space>
                            <Button type="primary" size="small" onClick={handleNutritionGoal}>
                                Definir objetivo nutricional
                            </Button>
                            <Button type="primary" size="small" onClick={handleActivityGoal}>
                                Definir objetivo físico
                            </Button>
                        </Space>
                    )}
                </div>
            }
        >
            <List
                size="small"
                dataSource={messages}
                renderItem={(msg, idx) => (
                    <List.Item key={idx}>
                        <Typography.Text strong>{msg.fromName}:</Typography.Text> {msg.text}
                    </List.Item>
                )}
            />
            <div ref={scrollRef} />

            <Input.TextArea
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
            />
            <Button type="primary" onClick={handleSend} style={{ marginTop: 8 }}>
                Enviar
            </Button>
        </Card>
    );
}
