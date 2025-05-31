import { Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { getExerciseGoals, updateExerciseGoals } from "../../api/exerciseGoals";

const ActivityGoals = () => {
    const [activityGoals, setActivityGoals] = useState([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getExerciseGoals()
            .then(res => {
                setActivityGoals(
                    [{ name: 'Calorías quemadas / Semana', value: res.data[0].calories_burned_goal, unit: 'Cal', key: 'calories_burned_goal' }]
                )
            })
            .catch(err => {
                console.error('Error loading exercise goals: ', err);
            })
    }, [])

    const [formActivity] = Form.useForm();

    const handleSave = () => {
        formActivity
            .validateFields()
            .then(
                values => {
                    updateExerciseGoals(values)
                        .then((res) => {
                            setActivityGoals([
                                { name: 'Calorías quemadas / Semana', value: res.data[0].calories_burned_goal, unit: 'Cal', key: 'calories_burned_goal' }
                            ])
                        }).catch((err) => {
                            console.error('Error updating exercise goals:', err);

                        })
                    setEdit(false)
                }
            ).catch(err => {
                console.error("Error updating activity goals:", err);
            })

    }

    const handleCancel = () => {
        setEdit(false)
        const originalValues = Object.fromEntries(
            activityGoals.map(item => [item.key, item.value])
        );
        formActivity.resetFields()
        formActivity.setFieldsValue(originalValues);
    }

    useEffect(() => {
        if (activityGoals.length > 0) {
            const formValues = Object.fromEntries(
                activityGoals.map(item => [item.key, item.value])
            );
            formActivity.setFieldsValue(formValues);
        }
    }, [activityGoals, formActivity]);

    return (
        <>
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Preparación física</Typography.Title>
                <div>
                    {edit ? (
                        <>
                            <Button onClick={handleSave}>Guardar</Button>
                            <Button onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEdit(true)}>Editar</Button>
                    )}
                </div>
            </Flex>
            <Form
                form={formActivity}
                name="activity-goals">
                <List
                    bordered
                    dataSource={activityGoals}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text>
                                {item.name}
                            </Typography.Text>

                            <Form.Item
                                name={item.key}
                                style={{ margin: 0, textAlign: 'right' }}
                                rules={[
                                    { required: true, message: 'Campo requerido' },
                                    { type: 'number', min: 1, message: 'Debe ser mayor a 0' }]}>
                                <InputNumber precision={0} readOnly={!edit} controls={false} suffix={item.unit} />
                            </Form.Item>
                        </List.Item>
                    )}
                />
            </Form>
        </>
    )
}

export default ActivityGoals