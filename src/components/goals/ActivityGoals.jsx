import { Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { getExerciseGoals, updateExerciseGoals } from "../../api/exerciseGoals";
import { useAuth } from "../../context/AuthContext";

const ActivityGoals = ({ userId }) => {
    const { user } = useAuth();
    const effectiveUserId = userId || user.id;

    const [activityGoals, setActivityGoals] = useState([]);
    const [edit, setEdit] = useState(false);
    const [formActivity] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState(true)


    useEffect(() => {
        getExerciseGoals(effectiveUserId)
            .then(res => {
                const data = res.data[0];
                setActivityGoals([
                    { name: 'Calorías quemadas / Semana', value: data.calories_burned_goal, unit: 'Cal', key: 'calories_burned_goal' }
                ]);
            })
            .catch(console.error);
    }, [effectiveUserId]);

    useEffect(() => {
        if (activityGoals.length > 0) {
            const formValues = Object.fromEntries(
                activityGoals.map(item => [item.key, item.value])
            );
            formActivity.setFieldsValue(formValues);
        }
    }, [activityGoals, formActivity]);

    const handleSave = () => {
        formActivity
            .validateFields()
            .then(values => {
                updateExerciseGoals({ ...values }, effectiveUserId)
                    .then(res => {
                        const data = res.data[0];
                        setActivityGoals([
                            { name: 'Calorías quemadas / Semana', value: data.calories_burned_goal, unit: 'Cal', key: 'calories_burned_goal' }
                        ]);
                        setEdit(false);
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    };

    const handleCancel = () => {
        setEdit(false);
        const originalValues = Object.fromEntries(
            activityGoals.map(item => [item.key, item.value])
        );
        formActivity.resetFields();
        formActivity.setFieldsValue(originalValues);
    };

    const handleValuesChange = async () => {
        try {
            await formActivity.validateFields()
        } catch (err) {
            setIsDisabled(err.errorFields.length > 0)
        }
    };

    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Preparación física</Typography.Title>
                <div>
                    {edit ? (
                        <>
                            <Button disabled={isDisabled} onClick={handleSave}>Guardar</Button>
                            <Button onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEdit(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form
                form={formActivity}
                name="activity-goals"
                onValuesChange={handleValuesChange}
            >
                <List
                    bordered
                    dataSource={activityGoals}
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
                                    readOnly={!edit}
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

export default ActivityGoals;
