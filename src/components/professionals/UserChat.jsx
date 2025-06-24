import { useEffect, useState } from 'react';
import { deletePatient, getMyProfessional } from '../../api/patient';
import { useAuth } from '../../context/AuthContext';
import { Chat } from './Chat';
import { Button, Flex, Form, Input, message, Modal, Rate, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cancelRequest } from '../../api/requestProfessional';
import { postReview } from '../../api/reviews';

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
        let intervalId;
        if (!targetId) {
            intervalId = setInterval(() => {
                getMyProfessional(user.id)
                    .then(res => {
                        if (res.data?.length > 0) {
                            setTargetId(res.data[0].id);
                            clearInterval(intervalId);
                        }
                    })
                    .catch(err => {
                        console.error("Error al obtener profesional:", err);
                    });
            }, 5000); // 5 segundos
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [user.id, targetId]);

    const handleChangeProfessional = () => {
        deletePatient(user.id)
            .then(() => {
                navigate('/profesionales')
            })
            .catch((err) => {
                console.error('Error al cambiar profesional: ', err);
            })
    }

    /* ----------------- MODAL ------------------- */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const openReviewModal = () => setIsModalOpen(true);
    const closeReviewModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    async function submitReview(values) {
        setSubmitting(true);
        postReview({
            professional_id: targetId,
            score: values.score,
            comment: values.comment,
        })
            .then(() => {
                message.success('¡Gracias por tu reseña!');
                closeReviewModal();
            })
            .catch((err) => {
                console.error(err)
                message.error('No se pudo enviar la reseña');
            })
            .finally(() => {
                setSubmitting(false);
            })
    }
    /* ----------------- MODAL ------------------- */

    return (
        <div>
            <Flex justify='space-between'>
                <Typography.Title level={3}>Chat con tu profesional</Typography.Title>
                <Flex>
                    {targetId ? (
                        <>
                            <Button onClick={openReviewModal} style={{ marginInline: 10 }}>
                                Reseñar
                            </Button>
                            <Button onClick={handleChangeProfessional}>
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

            {/* --------------- MODAL DE RESEÑA ---------------- */}
            <Modal
                title="Calificar profesional"
                open={isModalOpen}
                onCancel={closeReviewModal}
                onOk={() => form.submit()}
                okButtonProps={{ loading: submitting }}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={submitReview}
                    initialValues={{ score: 5 }}
                >
                    <Form.Item
                        name="score"
                        label="Puntaje"
                        rules={[{ required: true, message: 'Selecciona una puntuación' }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Comentario"
                        rules={[
                            { required: true, message: 'Escribe tu comentario' },
                            { max: 500, message: 'Máximo 500 caracteres' },
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="¿Qué te pareció la atención?" />
                    </Form.Item>
                </Form>
            </Modal>
            {/* ----------------------------------------------- */}
        </div>
    );
}
