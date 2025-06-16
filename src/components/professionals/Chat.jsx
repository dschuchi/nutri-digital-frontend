import { Button, Card, Flex, Input, List, Space, Typography, message as antdMessage } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getMessages, sendMessage } from '../../api/messages';
import { getUser } from '../../api/user';
import { useAuth } from '../../context/AuthContext';
import { NutritionGoalsModal } from '../modals/NutritionGoalsModal';
import { ActivityGoalsModal } from '../modals/ActivityGoalsModal';
import { MealPlanModal } from '../modals/MealPlanModal';
import { deletePatient } from '../../api/patient';
import { useNavigate } from 'react-router-dom';

export function Chat({ targetUserId, isProfessional = false }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [targetName, setTargetName] = useState('');
    const [openNutritionModal, setOpenNutritionModal] = useState(false);
    const [openActivityModal, setOpenActivityModal] = useState(false);
    const [openMealPlanModal, setOpenMealPlanModal] = useState(false);
    const { user } = useAuth();
    const scrollRef = useRef();
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(() => {
        if (!targetUserId) return;

        getUser(targetUserId)
            .then(res => {
                const user = res.data[0];
                const { name, lastname } = user || {};
                setTargetName(`${name || ''} ${lastname || ''}`);
            })
            .catch(() => antdMessage.error('Error al cargar usuario'));

        fetchMessages();
    }, [targetUserId]);

    const fetchMessages = () => {
        getMessages(targetUserId)
            .then(res => setMessages(res.data || []))
            .catch(() => antdMessage.error('Error al actualizar mensajes'));
    };

    const handleSend = () => {
        if (!text.trim()) return;
        sendMessage(targetUserId, text)
            .then(() => {
                setText('');
                fetchMessages();
                setIsDisabled(true)
            })
            .catch(() => antdMessage.error('Error al enviar mensaje'));
    };

    const handleDischargePatient = () => {
        deletePatient(targetUserId)
            .then(() => {
                navigate('/patients')
            })
            .catch(console.error)
    }

    const handleOnChange = (e) => {
        setText(e.target.value)
        setIsDisabled(e.target.value <= 0)
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography.Text strong>
                            Conversación con {targetName || '...'}
                        </Typography.Text>

                        {isProfessional && (
                            <Space>
                                <Button size="small" onClick={() => setOpenNutritionModal(true)}>
                                    Definir objetivo nutricional
                                </Button>
                                <Button size="small" onClick={() => setOpenActivityModal(true)}>
                                    Definir objetivo físico
                                </Button>
                                <Button size="small" onClick={() => setOpenMealPlanModal(true)}>
                                    Editar planificación
                                </Button>

                                <Button size="small" onClick={() => handleDischargePatient()}>
                                    Dar de alta
                                </Button>
                            </Space>
                        )}
                    </div>
                }
            >
                <Flex vertical justify='flex-end' style={{ height: '60vh' }}>
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
                        <List
                            size="small"
                            dataSource={messages}
                            renderItem={(item) => (
                                <div style={{ paddingBottom: 10 }}>
                                    <Typography.Text strong>
                                        {item.sender_user_id === user.id ? 'Tú' : targetName}:
                                    </Typography.Text>
                                    <div dangerouslySetInnerHTML={{ __html: item.text_content }}></div>
                                </div>
                            )}
                        />
                        <div ref={scrollRef} />
                    </div>


                    <Input.TextArea
                        rows={2}
                        value={text}
                        onChange={handleOnChange}
                        placeholder="Escribe tu mensaje aquí..."
                    />
                    <Button disabled={isDisabled} type="primary" onClick={handleSend} style={{ marginTop: 8 }}>
                        Enviar
                    </Button>
                </Flex>
            </Card>

            <NutritionGoalsModal
                open={openNutritionModal}
                onClose={() => setOpenNutritionModal(false)}
                patientId={targetUserId}
            />

            <ActivityGoalsModal
                open={openActivityModal}
                onClose={() => setOpenActivityModal(false)}
                patientId={targetUserId}
            />

            <MealPlanModal
                open={openMealPlanModal}
                onClose={() => setOpenMealPlanModal(false)}
                patientId={targetUserId}
            />
        </>
    );
}
