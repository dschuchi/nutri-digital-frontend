import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMicroNutrientGoals, updateMicroNutrientGoals } from "../../api/nutrientGoals";
import { Button, Flex, Form, InputNumber, List, Typography } from "antd";

const MicroGoals = () => {
    const [microNutrientGoals, setMicroNutrientGoals] = useState([]);
    const [editMicro, setEditMicro] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        getMicroNutrientGoals(user.id)
            .then((res) => {
                setMicroNutrientGoals([
                    { name: 'Grasa saturada', value: res.data[0].saturated_fat, unit: 'g', key: 'saturated_fat' },
                    { name: 'Grasa poliinsaturada', value: res.data[0].polyunsaturated_fat, unit: 'g', key: 'polyunsaturated_fat' },
                    { name: 'Grasa monoinsaturada', value: res.data[0].monounsaturated_fat, unit: 'g', key: 'monounsaturated_fat' },
                    { name: 'Grasa trans', value: res.data[0].trans, unit: 'g', key: 'trans' },
                    { name: 'Colesterol', value: res.data[0].cholesterol, unit: 'mg', key: 'cholesterol' },
                    { name: 'Sodio', value: res.data[0].sodium, unit: 'mg', key: 'sodium' },
                    { name: 'Potasio', value: res.data[0].potassium, unit: 'mg', key: 'potassium' },
                    { name: 'Fibra', value: res.data[0].fiber, unit: 'g', key: 'fiber' },
                    { name: 'Azúcar', value: res.data[0].sugar, unit: 'g', key: 'sugar' },
                    { name: 'Vitamina A', value: res.data[0].vitamin_a, unit: '%DV', key: 'vitamin_a' },
                    { name: 'Vitamina C', value: res.data[0].vitamin_c, unit: '%DV', key: 'vitamin_c' },
                    { name: 'Calcio', value: res.data[0].calcium, unit: '%DV', key: 'calcium' },
                    { name: 'Hierro', value: res.data[0].iron, unit: '%DV', key: 'iron' },
                ])
            })
            .catch((err) => { console.error("Error fetching nutrient goals:", err) });
    }, []);

    const [formMicro] = Form.useForm();


    const handleSaveMicro = () => {
        formMicro
            .validateFields()
            .then((values) => {
                updateMicroNutrientGoals(values)
                    .then((res) => {
                        console.log("Nutrient goals updated successfully:", res);
                        setMicroNutrientGoals([
                            { name: 'Grasa saturada', value: res.data[0].saturated_fat, unit: 'g', key: 'saturated_fat' },
                            { name: 'Grasa poliinsaturada', value: res.data[0].polyunsaturated_fat, unit: 'g', key: 'polyunsaturated_fat' },
                            { name: 'Grasa monoinsaturada', value: res.data[0].monounsaturated_fat, unit: 'g', key: 'monounsaturated_fat' },
                            { name: 'Grasa trans', value: res.data[0].trans, unit: 'g', key: 'trans' },
                            { name: 'Colesterol', value: res.data[0].cholesterol, unit: 'mg', key: 'cholesterol' },
                            { name: 'Sodio', value: res.data[0].sodium, unit: 'mg', key: 'sodium' },
                            { name: 'Potasio', value: res.data[0].potassium, unit: 'mg', key: 'potassium' },
                            { name: 'Fibra', value: res.data[0].fiber, unit: 'g', key: 'fiber' },
                            { name: 'Azúcar', value: res.data[0].sugar, unit: 'g', key: 'sugar' },
                            { name: 'Vitamina A', value: res.data[0].vitamin_a, unit: '%DV', key: 'vitamin_a' },
                            { name: 'Vitamina C', value: res.data[0].vitamin_c, unit: '%DV', key: 'vitamin_c' },
                            { name: 'Calcio', value: res.data[0].calcium, unit: '%DV', key: 'calcium' },
                            { name: 'Hierro', value: res.data[0].iron, unit: '%DV', key: 'iron' },
                        ]);
                    })
                    .catch((err) => {
                        console.error("Error updating nutrient goals:", err);
                    });
                setEditMicro(false);
            })
            .catch((info) => {
                console.log('Validación fallida:', info);
            });
    }


    useEffect(() => {
        if (microNutrientGoals.length > 0) {
            const formValues = Object.fromEntries(
                microNutrientGoals.map(item => [item.key, item.value])
            );
            formMicro.setFieldsValue(formValues);
        }
    }, [microNutrientGoals, formMicro]);

    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Micronutrientes</Typography.Title>
                <div>
                    {editMicro ? (
                        <>
                            <Button onClick={handleSaveMicro}>Guardar</Button>
                            <Button onClick={() => setEditMicro(false)}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMicro(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form
                form={formMicro}
                name="micro-goals">
                <List
                    bordered
                    dataSource={microNutrientGoals}
                    renderItem={(item) => (
                        <List.Item>
                            <div>
                                <Typography.Text strong>
                                    {item.name}
                                </Typography.Text>
                            </div>
                            <div>
                                {editMicro ? (
                                    <Form.Item
                                        name={item.key}
                                        style={{ margin: 0 }}
                                        rules={[
                                            { required: true, message: 'Campo requerido' },
                                            { type: 'number', min: 1, message: 'Debe ser mayor a 1' }
                                        ]}
                                    >
                                        <InputNumber suffix={item.unit} />
                                    </Form.Item>
                                ) : (
                                    <span>
                                        {item.value} {item.unit}
                                    </span>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </Form>
        </>
    )
}

export default MicroGoals