import { useEffect, useState } from "react";
import {
    DatePicker,
    Typography,
    Row,
    Col,
    Button,
    List,
    Card,
    Empty,
    Popconfirm,
    message,
} from "antd";
import {
    LeftOutlined,
    RightOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { getConsumedEntries, deleteConsumedEntry } from "../api/consumed";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const ConsumedEntries = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [entries, setEntries] = useState([]);

    const fetchData = async (date) => {
        try {
            const formatted = date.format("YYYY-MM-DD");
            const data = await getConsumedEntries(user.id, formatted);
            setEntries(data);
        } catch (err) {
            console.error("Error cargando consumos:", err);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData(selectedDate);
        }
    }, [selectedDate, user]);

    const changeDay = (days) => {
        setSelectedDate((prev) => prev.add(days, "day"));
    };

    const handleDelete = async (id) => {
        try {
            await deleteConsumedEntry(id);
            message.success("Entrada eliminada");
            fetchData(selectedDate);
        } catch (err) {
            console.error("Error al eliminar entrada:", err);
            message.error("No se pudo eliminar la entrada");
        }
    };

    // Agrupar por tipo de comida
    const grouped = entries.reduce((acc, item) => {
        const group = item.type_of_food || "Sin clasificar";
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
    }, {});

    return (
        <Card style={{ borderRadius: 12 }}>
            <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={4}>Alimentos consumidos</Title>
                </Col>
                <Col>
                    <Row align="middle" gutter={8}>
                        <Col>
                            <Button icon={<LeftOutlined />} onClick={() => changeDay(-1)} />
                        </Col>
                        <Col>
                            <DatePicker
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                format="YYYY-MM-DD"
                            />
                        </Col>
                        <Col>
                            <Button icon={<RightOutlined />} onClick={() => changeDay(1)} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            {Object.keys(grouped).length === 0 ? (
                <Empty description="No se registraron alimentos este día." />
            ) : (
                Object.entries(grouped).map(([type, items]) => (
                    <div key={type} style={{ marginBottom: 24 }}>
                        <Title level={5}>{type}</Title>
                        <List
                            dataSource={items}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="¿Eliminar esta entrada?"
                                            onConfirm={() => handleDelete(item.id)}
                                            okText="Sí"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                            />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Card style={{ width: "100%" }}>
                                        <Text strong>{item.name}</Text>
                                        <br />
                                        {[
                                            ["Calorías", item.calories],
                                            ["Proteínas", item.protein],
                                            ["Grasas", item.total_fat],
                                            ["Carbohidratos", item.total_carbs],
                                            ["Azúcar", item.sugars],
                                            ["Sodio", item.sodium],
                                        ]
                                            .filter(([, val]) => val != null)
                                            .map(([label, val]) => (
                                                <Text key={label} style={{ display: "block" }}>
                                                    {label}: {val}
                                                </Text>
                                            ))}
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                ))
            )}
        </Card>
    );
};

export default ConsumedEntries;
