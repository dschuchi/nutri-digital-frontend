import { Button, Card, Input, List, Space, Typography, message as antdMessage } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getMessages, sendMessage } from '../../api/messages';
import { getUser } from '../../api/user'; 
import { useAuth } from '../../context/AuthContext';

export function Chat({ targetUserId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [targetName, setTargetName] = useState('');
    const { user } = useAuth();
    const scrollRef = useRef();

    const fetchMessages = () => {
        if (!targetUserId) return;

        getMessages(targetUserId)
            .then(res => {
                setMessages(res.data || []);
                setTimeout(() => {
                    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            })
            .catch(() => {
                antdMessage.error("Error al cargar mensajes.");
            });
    };

    const fetchTargetName = () => {
        if (!targetUserId) return;

        getUser(targetUserId)
            .then(res => {
                const data = res.data[0];
                if (data?.name && data?.lastname) {
                    setTargetName(`${data.name} ${data.lastname}`);
                } else {
                    setTargetName('Usuario');
                }
            })
            .catch(() => {
                setTargetName('Usuario');
            });
    };

    useEffect(() => {
        fetchTargetName();
    }, [targetUserId]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [targetUserId]);

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            await sendMessage(targetUserId, text.trim());
            setText('');
            fetchMessages();
        } catch (err) {
            console.error("No se pudo enviar el mensaje.");
            antdMessage.error("No se pudo enviar el mensaje.");
        }
    };

    return (
        <Card title={`Conversación con ${targetName}`}>
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: '1rem' }}>
                <List
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item style={{ display: 'block' }}>
                            <Typography.Text strong>
                                {item.sender_user_id === user.id ? 'Tú' : targetName}:
                            </Typography.Text>
                            <div>{item.text_content}</div>
                        </List.Item>
                    )}
                />
                <div ref={scrollRef} />
            </div>

            <Input.TextArea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                placeholder="Escribe tu mensaje aquí..."
            />
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <Button type="primary" onClick={handleSend} disabled={!text.trim()}>
                    Enviar
                </Button>
            </div>
        </Card>
    );
}
