import { useEffect, useState, useMemo } from 'react';
import { Badge, Button, List, Popover, Typography, Space } from 'antd';
import { BellOutlined, DeleteOutlined } from '@ant-design/icons';
import { getReminder } from '../api/reminder';
import { getRequestsPending } from '../api/requestProfessional';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
    consumed: '¡No te olvides de cargar lo que comiste hoy y seguir tu progreso!',
    hidratation: '¡Hidratarte es clave! No olvides registrar tu consumo de agua.',
    exercise: '¡Tu cuerpo te lo va a agradecer! Registrá tu ejercicio diario.',
    requestPending: 'Tienes nuevas solicitudes de pacientes pendientes de aprobación.',
};

const NotificationsBell = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()

    const loadAllNotifications = () => {
        setLoading(true);

        Promise.all([
            getReminder(),
            getRequestsPending(user.id),
        ])
            .then(([remindersRes, pendingRes]) => {
                const result = Object.entries(remindersRes.data)
                    .filter(([, v]) => v === false)
                    .map(([k]) => ({ key: k }));

                if (pendingRes.data.pending) {
                    result.push({ key: 'requestPending' });
                }

                result.sort((a, b) => {
                    if (a.key === 'requestPending') return -1;
                    if (b.key === 'requestPending') return 1;
                    return 0;
                });

                setItems(result);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAllNotifications()
        const intervalId = setInterval(() => {
            loadAllNotifications();
        }, 10000); // 10 segundos
        return () => clearInterval(intervalId); // Limpieza (requerido)
    }, []);

    const unreadCount = useMemo(() => items.length, [items]);

    const handleDelete = (key) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
    };

    const popoverContent = (
        <List
            dataSource={items}
            locale={{ emptyText: 'Sin notificaciones pendientes' }}
            loading={loading}
            renderItem={({ key }) => (
                <List.Item
                    style={{ paddingRight: 0 }}
                    actions={[
                        <DeleteOutlined onClick={() => handleDelete(key)} style={{ color: '#ff4d4f' }} />
                    ]}
                >
                    <Space>
                        <Badge status="processing" />
                        <Typography.Text>{statusLabels[key] || key}</Typography.Text>
                    </Space>
                </List.Item>
            )}
        />
    );

    return (
        <Popover
            placement="bottomRight"
            content={popoverContent}
            trigger="click"
        >
            <Badge count={unreadCount} size="small">
                <Button
                    type="text"
                    shape="circle"
                    icon={<BellOutlined style={{ fontSize: 18, color: 'white' }} />}
                />
            </Badge>
        </Popover>
    );
};

export default NotificationsBell;
