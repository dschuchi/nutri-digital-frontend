import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMicroNutrientGoals, updateMicroNutrientGoals } from "../../api/nutrientGoals";
import { Button, Flex, Form, InputNumber, List, Typography } from "antd";

const MicroGoals = ({ userId }) => {
    const { user } = useAuth();
    const effectiveUserId = userId || user.id;

    const [microNutrientGoals, setMicroNutrientGoals] = useState([]);
    const [editMicro, setEditMicro] = useState(false);
    const [formMicro] = Form.useForm();

    useEffect(() => {
        getMicroNutrientGoals(effectiveUserId)
            .then((res) => {
                const data = res.data[0];
                setMicroNutrientGoals([
                    { name: 'Grasa saturada', value: data.saturated_fat, unit: 'g', key: 'saturated_fat' },
                    { name: 'Grasa poliinsaturada', value: data.polyunsaturated_fat, unit: 'g', key: 'polyunsaturated_fat' },
                    { name: 'Grasa monoinsaturada', value: data.monounsaturated_fat, unit: 'g', key: 'monounsaturated_fat' },
                    { name: 'Grasa trans', value: data.trans, unit: 'g', key: 'trans' },
                    { name: 'Colesterol', value: data.cholesterol, unit: 'mg', key: 'cholesterol' },
                    { name: 'Sodio', value: data.sodium, unit: 'mg', key: 'sodium' },
                    { name: 'Potasio', value: data.potassium, unit: 'mg', key: 'potassium' },
                    { name: 'Fibra', value: data.fiber, unit: 'g', key: 'fiber' },
                    { name: 'Azúcar', value: data.sugar, unit: 'g', key: 'sugar' },
                    { name: 'Vitamina A', value: data.vitamin_a, unit: '%DV', key: 'vitamin_a' },
                    { name: 'Vitamina C', value: data.vitamin_c, unit: '%DV', key: 'vitamin_c' },
                    { name: 'Calcio', value: data.calcium, unit: '%DV', key: 'calcium' },
                    { name: 'Hierro', value: data.iron, unit: '%DV', key: 'iron' },
                ]);
            })
            .catch(err => console.error("Error fetching nutrient goals:", err));
    }, [effectiveUserId]);

    useEffect(() => {
        if (microNutrientGoals.length > 0) {
            const formValues = Object.fromEntries(
                microNutrientGoals.map(item => [item.key, item.value])
            );
            formMicro.setFieldsValue(formValues);
        }
    }, [microNutrientGoals, formMicro]);

    const handleSaveMicro = () => {
        formMicro
            .validateFields()
            .then(values => {
                updateMicroNutrientGoals({ ...values, userId: effectiveUserId })
                    .then(res => {
                        const data = res.data[0];
                        setMicroNutrientGoals([
                            { name: 'Grasa saturada', value: data.saturated_fat, unit: 'g', key: 'saturated_fat' },
                            { name: 'Grasa poliinsaturada', value: data.polyunsaturated_fat, unit: 'g', key: 'polyunsaturated_fat' },
                            { name: 'Grasa monoinsaturada', value: data.monounsaturated_fat, unit: 'g', key: 'monounsaturated_fat' },
                            { name: 'Grasa trans', value: data.trans, unit: 'g', key: 'trans' },
                            { name: 'Colesterol', value: data.cholesterol, unit: 'mg', key: 'cholesterol' },
                            { name: 'Sodio', value: data.sodium, unit: 'mg', key: 'sodium' },
                            { name: 'Potasio', value: data.potassium, unit: 'mg', key: 'potassium' },
                            { name: 'Fibra', value: data.fiber, unit: 'g', key: 'fiber' },
                            { name: 'Azúcar', value: data.sugar, unit: 'g', key: 'sugar' },
                            { name: 'Vitamina A', value: data.vitamin_a, unit: '%DV', key: 'vitamin_a' },
                            { name: 'Vitamina C', value: data.vitamin_c, unit: '%DV', key: 'vitamin_c' },
                            { name: 'Calcio', value: data.calcium, unit: '%DV', key: 'calcium' },
                            { name: 'Hierro', value: data.iron, unit: '%DV', key: 'iron' },
                        ]);
                        setEditMicro(false);
                    })
                    .catch(err => console.error("Error updating nutrient goals:", err));
            })
            .catch(info => console.log("Validación fallida:", info));
    };

    const handleCancel = () => {
        setEditMicro(false);
        const originalValues = Object.fromEntries(
            microNutrientGoals.map(item => [item.key, item.value])
        );
        formMicro.resetFields();
        formMicro.setFieldsValue(originalValues);
    };

    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Micronutrientes</Typography.Title>
                <div>
                    {editMicro ? (
                        <>
                            <Button onClick={handleSaveMicro}>Guardar</Button>
                            <Button onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMicro(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form form={formMicro} name="micro-goals">
                <List
                    bordered
                    dataSource={microNutrientGoals}
                    renderItem={(item) => (
                        <List.Item key={item.key}>
                            <Typography.Text>{item.name}</Typography.Text>
                            <Form.Item
                                name={item.key}
                                style={{ margin: 0, textAlign: 'right' }}
                                rules={[
                                    { required: true, message: 'Campo requerido' },
                                    { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
                                ]}
                            >
                                <InputNumber
                                    precision={0}
                                    readOnly={!editMicro}
                                    controls={false}
                                    suffix={item.unit}
                                />
                            </Form.Item>
                        </List.Item>
                    )}
                />
            </Form>
        </>
    );
};

export default MicroGoals;
