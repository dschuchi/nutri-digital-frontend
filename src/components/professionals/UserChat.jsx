import { useEffect, useState } from 'react';
import { getMyProfessional } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Button, Flex, Typography } from 'antd';

export function UserChat() {
    const { user } = useAuth();
    const [targetId, setTargetId] = useState(null);

    useEffect(() => {
        getMyProfessional(user.id)
            .then(res => {
                if (res.data?.length > 0) {
                    setTargetId(res.data[0].id);
                }
            })
            .catch(err => {
                console.error("Error al obtener profesional:", err);
            });
    }, [user.id]);

    return (
        <div>
            <Flex justify='space-between'>
                <Typography.Title level={3}>Chat con tu profesional</Typography.Title>
                <Flex>
                    <Button style={{marginInline: 10}} disabled>
                        Reseñar
                    </Button>
                    <Button disabled>
                        Cambiar profesional
                    </Button>
                </Flex>
            </Flex>
            {targetId ? (
                <Chat targetUserId={targetId} />
            ) : (
                <Typography.Text>Tu solicitud aún no fue aceptada.</Typography.Text>
            )}
        </div>
    );
}
