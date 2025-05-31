import { Button, Flex, Form, InputNumber, List, Typography } from "antd";
import { useEffect, useState } from "react";

const ActivityGoals = () => {
    const [activityGoals, setActivityGoals] = useState([]);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        //TODO agregar petición al back
        setActivityGoals(
            [{ name: 'Calorías quemadas / Semana', value: 0, unit: 'Cal', key: 'burned_calories' }]
        )
    }, [])

    const [formActivity] = Form.useForm();

    const handleSave = () => {
        formActivity
            .validateFields()
            .then(
                values => {
                    //TODO agregar petición al back
                }
            ).catch(err => {
                console.error("Error updating activity goals:", err);
            })
        setEdit(false)
    }
    const handleCancel = () => {
        setEdit(false)
        const originalValues = Object.fromEntries(
            activityGoals.map(item => [item.key, item.value])
        );
        formActivity.resetFields()
        formActivity.setFieldsValue(originalValues);
    }

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