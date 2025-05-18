import { Button, Flex, Form, Input, InputNumber, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { getMacroNutrientGoals, getMicroNutrientGoals, updateMacroNutrientGoals } from "../api/nutrientGoals";
import { useAuth } from "../context/AuthContext";

const Goals = () => {
    const [microNutrientGoals, setMicroNutrientGoals] = useState([]);
    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [activityGoals, setActivityGoals] = useState([]);
    const [edit, setEdit] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        getMacroNutrientGoals(user.id)
            .then((res) => {
                setMacroNutrientGoals([
                    { name: 'Calorías', value: res.data[0].calories, unit: 'kcal', key: 'calories' },
                    { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: 'g', key: 'total_carbs' },
                    { name: 'Grasas', value: res.data[0].total_fat, unit: 'g', key: 'total_fat' },
                    { name: 'Proteínas', value: res.data[0].protein, unit: 'g', key: 'protein' },
                ]);
            })
            .catch((err) => { console.error("Error fetching nutrient goals:", err) });

        getMicroNutrientGoals(user.id)
            .then((res) => {
                setMicroNutrientGoals([
                    { name: 'Grasa saturada', value: res.data[0].saturated_fat, unit: 'g' },
                    { name: 'Grasa poliinsaturada', value: res.data[0].polyunsaturated_fat, unit: 'g' },
                    { name: 'Grasa monoinsaturada', value: res.data[0].monounsaturated_fat, unit: 'g' },
                    { name: 'Grasa trans', value: res.data[0].trans_fat, unit: 'g' },
                    { name: 'Colesterol', value: res.data[0].cholesterol, unit: 'mg' },
                    { name: 'Sodio', value: res.data[0].sodium, unit: 'mg' },
                    { name: 'Potasio', value: res.data[0].potassium, unit: 'mg' },
                    { name: 'Fibra', value: res.data[0].fiber, unit: 'g' },
                    { name: 'Azúcar', value: res.data[0].sugar, unit: 'g' },
                    { name: 'Vitamina A', value: res.data[0].vitamin_a, unit: '%DV' },
                    { name: 'Vitamina C', value: res.data[0].vitamin_c, unit: '%DV' },
                    { name: 'Calcio', value: res.data[0].calcium, unit: '%DV' },
                    { name: 'Hierro', value: res.data[0].iron, unit: '%DV' },
                ])
            })
            .catch((err) => { console.error("Error fetching nutrient goals:", err) });
    }, []);

    const [form] = Form.useForm();

    const handleSave = () => {
        form
            .validateFields()
            .then((values) => {
                updateMacroNutrientGoals(values)
                    .then((res) => {
                        console.log("Nutrient goals updated successfully:", res);
                        setMacroNutrientGoals([
                            { name: 'Calorías', value: res.data[0].calories, unit: 'kcal', key: 'calories' },
                            { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: 'g', key: 'total_carbs' },
                            { name: 'Grasas', value: res.data[0].total_fat, unit: 'g', key: 'total_fat' },
                            { name: 'Proteínas', value: res.data[0].protein, unit: 'g', key: 'protein' },
                        ]);
                    })
                    .catch((err) => {
                        console.error("Error updating nutrient goals:", err);
                    });
                setEdit(false);
            })
            .catch((info) => {
                console.log('Validación fallida:', info);
            });
    };

    useEffect(() => {
        if (macroNutrientGoals.length > 0) {
            const formValues = Object.fromEntries(
                macroNutrientGoals.map(item => [item.key, item.value])
            );
            form.setFieldsValue(formValues);
        }
    }, [macroNutrientGoals, form]);


    return (
        <div>
            <Typography.Title level={2}>Objetivos</Typography.Title>
            <Flex justify="space-around" align="center">
                <div style={{ width: "40%" }}>
                    <Flex vertical gap='large'>
                        <div>
                            <Flex justify="space-between" align="center">
                                <Typography.Title level={4}>Objetivos de nutrición diarios</Typography.Title>
                                <div>
                                    {edit ? (
                                        <>
                                            <Button onClick={handleSave}>Guardar</Button>
                                            <Button onClick={() => setEdit(false)}>Cancelar</Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => setEdit(true)}>Editar</Button>
                                    )}
                                </div>
                            </Flex>
                            <Form
                                form={form}
                                name="nutrient-goals">
                                <List
                                    bordered
                                    dataSource={macroNutrientGoals}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <div>
                                                <Typography.Text strong>
                                                    {item.name}
                                                </Typography.Text>
                                            </div>
                                            <div>
                                                {edit ? (
                                                    <Form.Item
                                                        name={item.key}
                                                        style={{ margin: 0 }}
                                                        rules={[{ required: true, message: 'Campo requerido' }]}
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

                        </div>

                        <div>
                            <Typography.Title level={4}>Preparación física</Typography.Title>
                            <List
                                bordered
                                dataSource={activityGoals}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div>
                                            <Typography.Text strong>
                                                {item.name}
                                            </Typography.Text>
                                        </div>
                                        <div>
                                            {item.value} {item.unit}
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Flex>
                </div>

                <div style={{ width: "40%" }}>
                    <Typography.Title level={4}>Micronutrientes</Typography.Title>
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
                                    {item.value} {item.unit}
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Flex>
        </div>
    );
};

export default Goals;