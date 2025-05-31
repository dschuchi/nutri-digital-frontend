import { Flex, List, Typography } from "antd";
import { useState } from "react";
import MacroGoals from "../components/goals/MacroGoals";
import MicroGoals from "../components/goals/MicroGoals";

const Goals = () => {
    const [activityGoals, setActivityGoals] = useState([]);
    return (
        <div>
            <Typography.Title level={2}>Objetivos</Typography.Title>
            <Flex justify="space-around" align="center">
                <div style={{ width: "40%" }}>
                    <Flex vertical gap='large'>
                        <div>
                            <MacroGoals />
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
                    <MicroGoals />
                </div>
            </Flex>
        </div>
    );
};

export default Goals;