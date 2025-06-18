import { Card, Col, Row, Typography, Progress } from 'antd';
import { FireOutlined, RiseOutlined, FallOutlined, DashboardOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const ResumenNutricionalMealPlanner = ({ macros, goals }) => {
  const getColor = (actual, target) => {
    if (actual > target) return 'red';
    if (actual > target * 0.75) return 'orange';
    return 'green';
  };

  const items = [
    {
      title: 'Calorías',
      icon: <FireOutlined />,
      value: macros.calories,
      goal: goals.calories,
    },
    {
      title: 'Carbs',
      icon: <RiseOutlined />,
      value: macros.total_carbs,
      goal: goals.total_carbs,
    },
    {
      title: 'Proteínas',
      icon: <DashboardOutlined />,
      value: macros.protein,
      goal: goals.protein,
    },
    {
      title: 'Grasas',
      icon: <FallOutlined />,
      value: macros.total_fat,
      goal: goals.total_fat,
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4}>Resumen nutricional</Title>
      <Row gutter={[16, 16]}>
        {items.map(({ title, icon, value, goal }) => {
          const percent = goal ? Math.min((value / goal) * 100, 100) : 0;
          const color = getColor(value, goal);
          return (
            <Col xs={24} sm={12} md={6} key={title}>
              <Card size="small" bordered style={{ borderColor: color }}>
                <Text strong>{icon} {title}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>{value ?? '-'} / {goal ?? '-'}</Text>
                  <Progress
                    percent={percent}
                    strokeColor={color}
                    size="small"
                    showInfo={false}
                    status={value > goal ? 'exception' : 'normal'}
                  />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
