import { Flex, Typography } from "antd";
import MacroGoals from "../components/goals/MacroGoals";
import MicroGoals from "../components/goals/MicroGoals";
import ActivityGoals from "../components/goals/ActivityGoals";

const Goals = () => {
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
                            <ActivityGoals />
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