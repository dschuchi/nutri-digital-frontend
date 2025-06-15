import { Button, Card, DatePicker, Empty, Flex, Form, InputNumber, Table, Typography } from "antd";
import { deleteHydration, getHydrationHistory, newHydration } from "../api/hydration";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import WaterGlassCard from "../components/Dashboard/WaterGlassCard/WaterGlassCard";

const Hydration = () => {
    const [hydrationHistory, setHydrationHistory] = useState([]);
    const [date, setDate] = useState(dayjs());
    const [form] = Form.useForm();

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

    const goalHydration = 2000;
    const totalHydration = hydrationHistory.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const sortedHydrationHistory = [...hydrationHistory].sort((a, b) => b.key - a.key);

    return (
        <div>
            <Typography.Title level={2}>Hidratación</Typography.Title>
            <Flex gap={'large'}>
                <Flex vertical gap={'large'}>
                    <Card title='¡Registra tu hidratación!' style={{ width: '30vw' }}>
                        <Form
                            form={form}
                            name="hydration"
                            onFinish={onFinish}
                            style={{ width: '100%' }}
                        >
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Flex gap="small" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="hydration"
                                        rules={[
                                            { required: true, message: 'Ingrese la cantidad de agua' },
                                            { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                                        ]}
                                        normalize={value => value ? Number(value) : value}
                                        style={{ flex: 1, marginBottom: 0 }}
                                    >
                                        <InputNumber
                                            placeholder="Cantidad de agua"
                                            type="number"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                    <Form.Item shouldUpdate>
                                        {() => {
                                            const hasErrors = form
                                                .getFieldsError()
                                                .some(({ errors }) => errors.length);
                                            const value = form.getFieldValue("hydration");

                                            return (
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    disabled={!value || hasErrors}
                                                >
                                                    Agregar
                                                </Button>
                                            );
                                        }}
                                    </Form.Item>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Card>
                    <WaterGlassCard consumoActual={totalHydration} consumoObjetivo={goalHydration} />
                </Flex>
                <Card style={{ width: '70vw' }}>
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
                        locale={{ emptyText: <Empty description='No se registran consumos hoy.' /> }}
                    />
                </Card>
            </Flex>
        </div>
    );
};

export default Hydration;