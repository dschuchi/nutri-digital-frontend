// pages/UserChat.jsx
import { useEffect, useState } from 'react';
import { getMyProfessional } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Typography } from 'antd';

export function UserChat() {
    const { user } = useAuth();
    const [targetId, setTargetId] = useState(null);

    useEffect(() => {
        getMyProfessional(user.id)
            .then(res => {
                console.log("Respuesta getMyProfessional:", res.data);
                if (res.data?.length > 0) {
                    setTargetId(res.data[0].id);
                }
            })
            .catch(err => {
                console.error("Error al obtener profesional:", err);
            });
    }, [user.id]);

    return (
        <div style={{ padding: '16px' }}>
            <Typography.Title level={3}>Chat con tu profesional</Typography.Title>
            {targetId ? (
                <Chat targetUserId={targetId} />
            ) : (
                <Typography.Text>Tu solicitud aún no fue aceptada.</Typography.Text>
            )}
        </div>
    );
}
