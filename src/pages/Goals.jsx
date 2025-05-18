import { Flex, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { searchMicroNutrientGoals } from "../api/nutrientGoals";

const Goals = () => {
    const [microNutrientGoals, setMicroNutrientGoals] = useState([]);
    const [macroNutrientGoals, setMacroNutrientGoals] = useState([]);
    const [activityGoals, setActivityGoals] = useState([]);

    useEffect(() => {
        searchMicroNutrientGoals(1)
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

    return (
        <div>
            <Typography.Title level={2}>Objetivos</Typography.Title>
            <Flex justify="space-around" align="center">
                <div style={{ width: "40%" }}>
                    <Flex vertical gap='large'>
                        <div>
                            <Typography.Title level={4}>Objetivos de nutrición diarios</Typography.Title>
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
                                            {item.name}
                                        </div>
                                    </List.Item>
                                )}
                            />
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
                                            {item.name}
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