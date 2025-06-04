import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Alert, Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { getMacroNutrientGoals, updateMacroNutrientGoals } from "../../api/nutrientGoals";

const MacroGoals = ({ userId }) => {
    const { user } = useAuth();
    const effectiveUserId = userId || user.id;

    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [editMacro, setEditMacro] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        getMacroNutrientGoals(effectiveUserId)
            .then((res) => {
                setMacroNutrientGoals([
                    { name: 'Calorías', value: res.data[0].calories, unit: '', key: 'calories' },
                    { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: '%', key: 'total_carbs' },
                    { name: 'Grasas', value: res.data[0].total_fat, unit: '%', key: 'total_fat' },
                    { name: 'Proteínas', value: res.data[0].protein, unit: '%', key: 'protein' },
                ]);
            })
            .catch((err) => { console.error("Error fetching nutrient goals:", err) });
    }, [effectiveUserId]);

    const [formMacro] = Form.useForm();

    const handleSaveMacro = () => {
        formMacro
            .validateFields()
            .then((values) => {
                updateMacroNutrientGoals({ ...values, userId: effectiveUserId })
                    .then((res) => {
                        setMacroNutrientGoals([
                            { name: 'Calorías', value: res.data[0].calories, unit: 'cal', key: 'calories' },
                            { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: '%', key: 'total_carbs' },
                            { name: 'Grasas', value: res.data[0].total_fat, unit: '%', key: 'total_fat' },
                            { name: 'Proteínas', value: res.data[0].protein, unit: '%', key: 'protein' },
                        ]);
                        setEditMacro(false);
                        setShowError(false);
                    })
                    .catch((err) => {
                        console.error("Error updating nutrient goals:", err);
                    });
            })
            .catch(() => {
                setShowError(true);
            });
    };

    const handleCancel = () => {
        setEditMacro(false);
        setShowError(false);
        const originalValues = Object.fromEntries(
            macroNutrientGoals.map(item => [item.key, item.value])
        );
        formMacro.resetFields();
        formMacro.setFieldsValue(originalValues);
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
            values.protein !== undefined &&
            total !== 100
        ) {
            return Promise.reject();
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
                            <Button onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMacro(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form form={formMacro} name="macro-goals">
                {showError && (
                    <Form.Item>
                        <Alert
                            message="La suma de carbohidratos, grasas y proteínas debe ser exactamente 100%"
                            type="error"
                            showIcon
                            closable
                            onClose={() => setShowError(false)}
                        />
                    </Form.Item>
                )}
                <List bordered>
                    {macroNutrientGoals.map((item) => (
                        <List.Item key={item.key}>
                            <Typography.Text>{item.name}</Typography.Text>
                            <Form.Item
                                name={item.key}
                                style={{ margin: 0, textAlign: 'right' }}
                                rules={[
                                    { required: true, message: 'Campo requerido' },
                                    { type: 'number', min: 1, message: 'Debe ser mayor a 0' },
                                    item.key !== 'calories' && { validator: validateMacroSum },
                                ].filter(Boolean)}
                            >
                                <InputNumber
                                    precision={0}
                                    readOnly={!editMacro}
                                    controls={false}
                                    suffix={item.unit}
                                />
                            </Form.Item>
                        </List.Item>
                    ))}
                </List>
            </Form>
        </>
    );
};

export default MacroGoals;
