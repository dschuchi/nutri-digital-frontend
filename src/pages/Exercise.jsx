import { Button, Card, DatePicker, Divider, Empty, Flex, Form, Image, InputNumber, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { deleteExercise, getAllExercises, getExerciseHistory, newExercise } from "../api/exercise";
import { useAuth } from '../context/AuthContext';


const Exercise = () => {
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [allExercises, setAllExercises] = useState([])
    const [date, setDate] = useState(dayjs());
    const { user } = useAuth()

    const fetchExercise = (selectedDate) => {
        const dateString = selectedDate.startOf('day').toISOString();
        getExerciseHistory(dateString, user.id)
            .then(res => {
                setExerciseHistory(res.data)
            })
            .catch((err) => {
                console.error("Error fetching exercise history:", err);
            });
    };

    const fetchAllExercises = () => {
        getAllExercises()
            .then(res => {
                setAllExercises(res.data)
            })
            .catch(console.error)
    }

    useEffect(() => {
        fetchAllExercises()
    }, []);

    useEffect(() => {
        fetchExercise(date);
    }, [date]);

    function onFinish(values) {
        newExercise({
            id_user: user.id,
            id_exercise: values.exerciseId,
            calories_burned: values.calories,
            date: date.format('YYYY-MM-DD')
        })
            .then(() => {
                fetchExercise(date)
            })
            .catch(console.error);
    }

    const handleDelete = (id) => {
        deleteExercise(id)
            .then(() => {
                fetchExercise(date)
            })
            .catch((err) => {
                console.error("Error al borrar el ejercicio:", err);
            });
    };

    return (
        <div>
            <Typography.Title level={2}>Actividad fisica</Typography.Title>
            <Flex gap={'large'}>
                <Flex vertical gap={'large'}>
                    <Card title='Cada paso cuenta: registra tu esfuerzo'>
                        <Form
                            name="exercise"
                            onFinish={onFinish}
                            style={{ width: '100%' }}
                        >
                            <Form.Item
                                name="exerciseId"
                                rules={[{ required: true, message: 'Seleccione actividad' }]}
                            >
                                <Select placeholder="Actividad">
                                    {allExercises.map((e) => (
                                        <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Flex gap="small" align="center" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="calories"
                                        rules={[
                                            { required: true, message: 'Ingrese cantidad de calorias quemadas' },
                                            { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                                        ]}
                                        normalize={value => value ? Number(value) : value}
                                        style={{ flex: 1, marginBottom: 0 }}
                                    >
                                        <InputNumber
                                            placeholder="Calorias quemadas"
                                            type="number"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Agregar
                                    </Button>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Card>
                        <Image
                            style={{ mixBlendMode: "multiply" }}
                            src='exercise.png'
                            preview={false}
                        />
                    </Card>
                </Flex>
                <Card style={{ width: '70vw' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                        <Typography.Title level={4}>Historial de actividad fisica</Typography.Title>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            allowClear={false}
                            format="YYYY-MM-DD"
                        />
                    </Flex>
                    <Table
                        dataSource={exerciseHistory.map((item) => ({
                            ...item,
                            key: item.id
                        }))}
                        columns={[
                            {
                                title: 'Fecha',
                                dataIndex: 'date',
                                key: 'date',
                            },
                            {
                                title: 'Calorias quemadas',
                                dataIndex: 'calories_burned',
                                key: 'calories_burned',
                            },
                            {
                                title: 'Acción',
                                key: 'accion',
                                render: (_, record) => (
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => handleDelete(record.key)}
                                    >
                                        Borrar
                                    </Button>
                                ),
                            },
                        ]}
                        pagination
                        size="small"
                        locale={{ emptyText: <Empty description='No se registran consumos hoy.' /> }}
                    />
                </Card>
            </Flex>
        </div>
    );
};

export default Exercise;