import { useEffect, useState } from 'react';
import { getMyProfessional } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Button, Flex, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cancelRequest } from '../../api/requestProfessional';

export function UserChat() {
    const { user } = useAuth();
    const [targetId, setTargetId] = useState(null);
    const [searchParams] = useSearchParams();
    const reqId = searchParams.get('req')
    const navigate = useNavigate()

    function handleCancel() {
        cancelRequest(reqId)
            .then(res => navigate('/profesionales'))
            .catch(err => console.error("Error al cancelar solicitud"))
    }

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
                    {targetId ? (
                        <>
                            <Button style={{ marginInline: 10 }} disabled>
                                Reseñar
                            </Button>
                            <Button disabled>
                                Cambiar profesional
                            </Button>
                        </>
                    ) : (
                        <Button danger onClick={handleCancel}> Cancelar solicitud </Button>
                    )}
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
