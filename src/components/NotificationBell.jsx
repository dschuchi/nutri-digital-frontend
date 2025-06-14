import { useEffect, useState, useMemo } from 'react';
import { Badge, Button, List, Popover, Typography, Space } from 'antd';
import { BellOutlined, DeleteOutlined } from '@ant-design/icons';
import { getReminder } from '../api/reminder';

const statusLabels = {
    consumed: 'No se registraron calorías consumidas',
    hidratation: 'No se registró hidratación',
    exercise: 'No se registró ejercicio',
};

const NotificationsBell = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = () => {
        setLoading(true);
        getReminder()
            .then((res) => {
                const list = Object.entries(res.data)
                    .filter(([, value]) => value === false)
                    .map(([key]) => ({ key }));
                setItems(list);
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        fetchNotifications()
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
