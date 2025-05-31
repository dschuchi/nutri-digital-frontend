import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { getMacroNutrientGoals, updateMacroNutrientGoals } from "../../api/nutrientGoals";


const MacroGoals = () => {
    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [editMacro, setEditMacro] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        getMacroNutrientGoals(user.id)
            .then((res) => {
                setMacroNutrientGoals([
                    { name: 'Calorías', value: res.data[0].calories, unit: '', key: 'calories' },
                    { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: '%', key: 'total_carbs' },
                    { name: 'Grasas', value: res.data[0].total_fat, unit: '%', key: 'total_fat' },
                    { name: 'Proteínas', value: res.data[0].protein, unit: '%', key: 'protein' },
                ]);
            })
            .catch((err) => { console.error("Error fetching nutrient goals:", err) });
    }, [])

    const [formMacro] = Form.useForm();

    const handleSaveMacro = () => {
        formMacro
            .validateFields()
            .then((values) => {
                updateMacroNutrientGoals(values)
                    .then((res) => {
                        console.log("Nutrient goals updated successfully:", res);
                        setMacroNutrientGoals([
                            { name: 'Calorías', value: res.data[0].calories, unit: 'kcal', key: 'calories' },
                            { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: '%', key: 'total_carbs' },
                            { name: 'Grasas', value: res.data[0].total_fat, unit: '%', key: 'total_fat' },
                            { name: 'Proteínas', value: res.data[0].protein, unit: '%', key: 'protein' },
                        ]);
                    })
                    .catch((err) => {
                        console.error("Error updating nutrient goals:", err);
                    });
                setEditMacro(false);
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
            formMacro.setFieldsValue(formValues);
        }
    }, [macroNutrientGoals, formMacro]);


    const validateMacroSum = (_, value) => {
        const values = formMacro.getFieldsValue();
        const total =
            Number(values.total_carbs || 0) +
            Number(values.total_fat || 0) +
            Number(values.protein || 0);
        if (
            values.total_carbs !== undefined &&
            values.total_fat !== undefined &&
            values.protein !== undefined
        ) {
            if (total !== 100) {
                return Promise.reject('La suma de carbohidratos, grasas y proteínas debe ser exactamente 100%');
            }
        }
        return Promise.resolve();
    };


    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Objetivos de nutrición diarios</Typography.Title>
                <div>
                    {editMacro ? (
                        <>
                            <Button onClick={handleSaveMacro}>Guardar</Button>
                            <Button onClick={() => setEditMacro(false)}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMacro(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form
                form={formMacro}
                name="macro-goals">
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
                                {editMacro ? (
                                    <Form.Item
                                        name={item.key}
                                        style={{ margin: 0 }}
                                        rules={[
                                            { required: true, message: 'Campo requerido' },
                                            { type: 'number', min: 1, message: 'Debe ser mayor a 1' },
                                            ...(item.key === 'total_carbs' || item.key === 'total_fat' || item.key === 'protein'
                                                ? [{ validator: validateMacroSum }]
                                                : [])
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
    );
};

export default MacroGoals;