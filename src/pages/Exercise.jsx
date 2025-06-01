import { Button, Card, DatePicker, Divider, Empty, Flex, Form, Image, InputNumber, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { deleteExercise, getExerciseHistory } from "../api/exercise";

const Exercise = () => {
    const [exerciseHistory, setExerciseHistory] = useState([]);
    const [date, setDate] = useState(dayjs());

    const fetchExercise = (selectedDate) => {
        const dateString = selectedDate.startOf('day').toISOString();
        getExerciseHistory(dateString)
            .then()
            .catch((err) => {
                console.error("Error fetching exercise history:", err);
            });
    };

    useEffect(() => {
        fetchExercise(date);
    }, [date]);

    function onFinish(values) {

    }

    const handleDelete = (id) => {
        deleteExercise(id)
            .then()
            .catch((err) => {
                console.error("Error al borrar el ejercicio:", err);
            });
    };

    //const goalHydration = 2000;
    //const totalHydration = hydrationHistory.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const sortedExerciseHistory = [...exerciseHistory].sort((a, b) => b.key - a.key);

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
                                name="name"
                                rules={[{ required: true, message: 'Seleccione actividad' }]}
                            >
                                <Select placeholder="Actividad">
                                    <Option value='Correr'>Correr</Option>
                                    <Option value='Caminar'>Caminar</Option>
                                    <Option value='Nadar'>Nadar</Option>
                                    <Option value='Futbol'>Futbol</Option>
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
                        dataSource={sortedExerciseHistory}
                        columns={[
                            {
                                title: 'Fecha',
                                dataIndex: 'fecha',
                                key: 'fecha',
                            },
                            {
                                title: 'Calorias quemadas',
                                dataIndex: 'cantidad',
                                key: 'cantidad',
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