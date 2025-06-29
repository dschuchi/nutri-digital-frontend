import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { getMacroNutrientGoals, updateMacroNutrientGoals } from "../../api/nutrientGoals";

const MacroGoals = ({ userId }) => {
    const { user } = useAuth();
    const effectiveUserId = userId || user.id;

    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [editMacro, setEditMacro] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(() => {
        getMacroNutrientGoals(effectiveUserId)
            .then((res) => {
                setMacroNutrientGoals([
                    { name: 'Calorías', value: res.data[0].calories, unit: 'cal', key: 'calories' },
                    { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: 'g', key: 'total_carbs' },
                    { name: 'Grasas', value: res.data[0].total_fat, unit: 'g', key: 'total_fat' },
                    { name: 'Proteínas', value: res.data[0].protein, unit: 'g', key: 'protein' },
                ]);
            })
            .catch(console.error);
    }, [effectiveUserId]);

    const [formMacro] = Form.useForm();

    const handleSaveMacro = () => {
        formMacro
            .validateFields()
            .then((values) => {
                updateMacroNutrientGoals({ ...values }, effectiveUserId)
                    .then((res) => {
                        setMacroNutrientGoals([
                            { name: 'Calorías', value: res.data[0].calories, unit: 'cal', key: 'calories' },
                            { name: 'Carbohidratos', value: res.data[0].total_carbs, unit: 'g', key: 'total_carbs' },
                            { name: 'Grasas', value: res.data[0].total_fat, unit: 'g', key: 'total_fat' },
                            { name: 'Proteínas', value: res.data[0].protein, unit: 'g', key: 'protein' },
                        ]);
                        setEditMacro(false);
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    };

    const handleCancel = () => {
        setEditMacro(false);
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

    const handleValuesChange = async () => {
        try {
            await formMacro.validateFields()
        } catch (err) {
            setIsDisabled(err.errorFields.length > 0)
        }
    };

    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Objetivos de nutrición diarios</Typography.Title>
                <div>
                    {editMacro ? (
                        <>
                            <Button disabled={isDisabled} onClick={handleSaveMacro}>Guardar</Button>
                            <Button onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEditMacro(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form
                form={formMacro}
                name="macro-goals"
                onValuesChange={handleValuesChange}
            >
                <List bordered>
                    {macroNutrientGoals.map((item) => (
                        <List.Item key={item.key}>
                            <Typography.Text>{item.name}</Typography.Text>
                            <Form.Item
                                name={item.key}
                                style={{ margin: 0, textAlign: 'right' }}
                                rules={[
                                    { required: true, message: 'Campo requerido' },
                                    { type: 'number', min: 1, message: 'Debe ser mayor a 0' }
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
