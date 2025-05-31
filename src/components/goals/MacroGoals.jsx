import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Alert, Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { getMacroNutrientGoals, updateMacroNutrientGoals } from "../../api/nutrientGoals";


const MacroGoals = () => {
    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [editMacro, setEditMacro] = useState(false);
    const { user } = useAuth();
    const [showError, setShowError] = useState(false);


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
                setShowError(false)

            })
            .catch((info) => {
                setShowError(true)
                console.log('Validación fallida:', info);
            });
    };

    const handleCancel = () => {
        setEditMacro(false)
        setShowError(false)

        const originalValues = Object.fromEntries(
            macroNutrientGoals.map(item => [item.key, item.value])
        );
        formMacro.resetFields()
        formMacro.setFieldsValue(originalValues);
    }


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
                return Promise.reject();
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
                        <Alert message="La suma de carbohidratos, grasas y proteínas debe ser exactamente 100%" type="error" showIcon closable onClose={() => setShowError(false)} />
                    </Form.Item>
                )}
                <List bordered>
                    <List.Item>
                        <Typography.Text>
                            Calorías
                        </Typography.Text>
                        <Form.Item
                            name='calories'
                            style={{ margin: 0, textAlign: 'right' }}
                            rules={[
                                { required: true, message: 'Campo requerido' },
                                { type: 'number', min: 1, message: 'Debe ser mayor a 0' }]}>
                            <InputNumber readOnly={!editMacro} suffix='' />
                        </Form.Item>
                    </List.Item>
                    <List.Item>
                        <Typography.Text>
                            Carbohidratos
                        </Typography.Text>
                        <Form.Item
                            name='total_carbs'
                            style={{ margin: 0, textAlign: 'right' }}
                            rules={[
                                { required: true, message: 'Campo requerido' },
                                { type: 'number', min: 1, message: 'Debe ser mayor a 0' },
                                { validator: validateMacroSum }]}>
                            <InputNumber readOnly={!editMacro} suffix='%' />
                        </Form.Item>
                    </List.Item>
                    <List.Item>
                        <Typography.Text>
                            Grasas
                        </Typography.Text>
                        <Form.Item
                            name='total_fat'
                            style={{ margin: 0, textAlign: 'right' }}
                            rules={[
                                { required: true, message: 'Campo requerido' },
                                { type: 'number', min: 1, message: 'Debe ser mayor a 0' },
                                { validator: validateMacroSum }]}>
                            <InputNumber readOnly={!editMacro} suffix='%' />
                        </Form.Item>
                    </List.Item>
                    <List.Item>
                        <Typography.Text>
                            Proteínas
                        </Typography.Text>
                        <Form.Item
                            name='protein'
                            style={{ margin: 0, textAlign: 'right' }}
                            rules={[
                                { required: true, message: 'Campo requerido' },
                                { type: 'number', min: 1, message: 'Debe ser mayor a 0' },
                                { validator: validateMacroSum }]}>
                            <InputNumber readOnly={!editMacro} suffix='%' />
                        </Form.Item>
                    </List.Item>
                </List>
            </Form >
        </>
    );
};

export default MacroGoals;