import { Button, Card, Col, Form, Input, InputNumber, Row, Typography, } from "antd";

const { Title } = Typography;

export default function NewFood() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log(values);
    };

    const nutrientFields = [
        { name: "name", label: "Nombre" },
        { name: "calories", label: "Calorías" },
        { name: "serving", label: "Porción" },
        { name: "total_carbs", label: "Carbohidratos" },
        { name: "sugars", label: "Azúcares" },
        { name: "total_fat", label: "Grasas Totales" },
        { name: "saturated", label: "Grasas Saturadas" },
        { name: "trans", label: "Grasas Trans" },
        { name: "protein", label: "Proteínas" },
        { name: "sodium", label: "Sodio" },
        { name: "potassium", label: "Potasio" },
        { name: "dietary_fiber", label: "Fibra" },
        { name: "cholesterol", label: "Colesterol" },
        { name: "vitamin_a", label: "Vitamina A" },
        { name: "vitamin_c", label: "Vitamina C" },
        { name: "calcium", label: "Calcio" },
        { name: "iron", label: "Hierro" },
    ];

    return (
        <>
            <Title level={3}>Registrar Nuevo Alimento</Title>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: "Ingresa nombre" }]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        {nutrientFields
                            .filter((field) => field.name !== "name")
                            .map((field) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    key={field.name}
                                >
                                    <Form.Item
                                        name={field.name}
                                        label={field.label}
                                        rules={[
                                            { required: true, message: 'Campo requerido' },
                                            { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            placeholder={field.label}
                                        />
                                    </Form.Item>
                                </Col>
                            ))}
                    </Row>

                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </Form>
            </Card>
        </>
    );
}
