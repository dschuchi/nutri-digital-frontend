import { Button, Card, DatePicker, Divider, Flex, Form, Input, Table, Typography } from "antd";
import { deleteHydration, getHydrationHistory, newHydration } from "../api/hydration";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const Hydration = () => {
    const [hydrationHistory, setHydrationHistory] = useState([]);
    const [date, setDate] = useState(dayjs());

    const fetchHydration = (selectedDate) => {
        const dateString = selectedDate.startOf('day').toISOString();
        getHydrationHistory(dateString)
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    fecha: item.date_consumed ? item.date_consumed.split('T')[0] : '',
                    cantidad: item.mililiters,
                }));
                setHydrationHistory(mappedData);
            })
            .catch((err) => {
                console.error("Error fetching hydration history:", err);
            });
    };

    useEffect(() => {
        fetchHydration(date);
    }, [date]);

    function onFinish(values) {
        newHydration({
            mililiters: values.hydration,
            date_consumed: date.format('YYYY-MM-DD'),
        })
            .then((res) => {
                setHydrationHistory((prev) => [
                    ...prev,
                    {
                        key: res.data.id,
                        fecha: res.data.date_consumed.split('T')[0],
                        cantidad: res.data.mililiters,
                    },
                ]);
            })
            .catch((err) => {
                console.error("Error al registrar hidratación:", err);
            });
    }

    const handleDelete = (id) => {
        deleteHydration(id)
            .then(() => {
                setHydrationHistory((prev) => prev.filter((item) => item.key !== id));
            })
            .catch((err) => {
                console.error("Error al borrar hidratación:", err);
            });
    };

    const totalHidratacion = hydrationHistory.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const sortedHydrationHistory = [...hydrationHistory].sort((a, b) => b.key - a.key);

    return (
        <div>
            <Typography.Title level={2}>Hidratación</Typography.Title>
            <Flex vertical gap={'large'}>
                <Card style={{ textAlign: 'center' }}>
                    <Typography.Title level={2}>{totalHidratacion} ml</Typography.Title>
                    <Divider />
                    <Form
                        name="hydration"
                        onFinish={onFinish}
                    >
                        <Form.Item>
                            <Flex gap="small" justify="center">
                                <Form.Item
                                    name="hydration"
                                    rules={[
                                        { required: true, message: 'Ingrese la cantidad de agua' },
                                        { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                                    ]}
                                    normalize={value => value ? Number(value) : value}
                                >
                                    <Input
                                        placeholder="Cantidad de agua"
                                        type="number"
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
                    <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                        <Typography.Title level={4}>Historial de hidratación</Typography.Title>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            allowClear={false}
                            format="YYYY-MM-DD"
                        />
                    </Flex>
                    <Table
                        dataSource={sortedHydrationHistory}
                        columns={[
                            {
                                title: 'Fecha',
                                dataIndex: 'fecha',
                                key: 'fecha',
                            },
                            {
                                title: 'Cantidad (ml)',
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
                    />
                </Card>
            </Flex>
        </div>
    );
};

export default Hydration;