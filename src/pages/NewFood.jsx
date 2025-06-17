import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Typography,
} from "antd";
import { newFood } from "../api/food";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function NewFood() {
    const [form] = Form.useForm();
    const navigate = useNavigate()

    const onFinish = (values) => {
        newFood(values)
            .then(() => {
                navigate('/agregar-alimento')
            })
            .catch(console.error)
    };

    const fields = [
        { name: "brand", label: "Marca", type: "text" },
        { name: "serving", label: "Tamaño de la Porción", type: "text" },
        { name: "calories", label: "Calorías", type: "number" },
        { name: "sodium", label: "Sodio", type: "number" },
        { name: "total_fat", label: "Grasas Totales", type: "number" },
        { name: "potassium", label: "Potasio", type: "number" },
        { name: "saturated", label: "Grasas Saturadas", type: "number" },
        { name: "total_carbs", label: "Carbohidratos", type: "number" },
        { name: "polyunsaturated", label: "Poliinsaturadas", type: "number" },
        { name: "dietary_fiber", label: "Fibra", type: "number" },
        { name: "monounsaturated", label: "Monounsaturadas", type: "number" },
        { name: "sugars", label: "Azúcares", type: "number" },
        { name: "trans", label: "Grasas Trans", type: "number" },
        { name: "protein", label: "Proteínas", type: "number" },
        { name: "cholesterol", label: "Colesterol", type: "number" },
        { name: "vitamin_a", label: "Vitamina A", type: "number" },
        { name: "calcium", label: "Calcio", type: "number" },
        { name: "vitamin_c", label: "Vitamina C", type: "number" },
        { name: "iron", label: "Hierro", type: "number" },
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
                    {/* Nombre */}
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: "Ingresa nombre" }]}
                    >
                        <Input placeholder="Nombre" />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        {fields.map((field) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={field.name}>
                                <Form.Item
                                    name={field.name}
                                    label={field.label}
                                    rules={[
                                        { required: true, message: "Campo requerido" },
                                        ...(field.type === "number"
                                            ? [{ type: "number", min: 0, message: "Debe ser mayor o igual a 0" }]
                                            : []),
                                    ]}
                                >
                                    {field.type === "text" ? (
                                        <Input placeholder={field.label} />
                                    ) : (
                                        <InputNumber
                                            style={{ width: "100%" }}
                                            placeholder={field.label}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        ))}

                        {/* Restricciones */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item
                                name="restricciones"
                                label="Restricciones"
                                rules={[{ required: true, message: "Selecciona al menos una" }]}
                            >
                                <Select mode="multiple" placeholder="Selecciona restricciones">
                                    <Option value="Vegano">Vegano</Option>
                                    <Option value="Vegetariano">Vegetariano</Option>
                                    <Option value="Sin TACC">Sin TACC</Option>
                                    <Option value="Sin Lactosa">Sin Lactosa</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Tipo */}
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item
                                name="tipo"
                                label="Tipo"
                                rules={[{ required: true, message: "Selecciona el tipo" }]}
                            >
                                <Select placeholder="Selecciona el tipo">
                                    <Option value="Comida">Comida</Option>
                                    <Option value="Bebida">Bebida</Option>
                                    <Option value="Suplemento">Suplemento</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit">
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}
