import { Card, Typography, Collapse, Progress } from 'antd';

const { Text } = Typography;
const { Panel } = Collapse;

const MicronutrientsCard = ({ data }) => {
  const safe = (v) => (v == null ? 0 : v);

  const micronutrientes = [
    { label: 'Vitamina A', actual: safe(data.vitamin_a), objetivo: safe(data.goals?.vitamin_a) },
    { label: 'Vitamina C', actual: safe(data.vitamin_c), objetivo: safe(data.goals?.vitamin_c) },
    { label: 'Hierro', actual: safe(data.iron), objetivo: safe(data.goals?.iron) },
    { label: 'Calcio', actual: safe(data.calcium), objetivo: safe(data.goals?.calcium) },
    { label: 'Potasio', actual: safe(data.potassium), objetivo: safe(data.goals?.potassium) },
  ];

  return (
    <Card style={{ borderRadius: 12 }}>
      <Collapse ghost>
        <Panel header="Micronutrientes" key="1">
          {micronutrientes.map((item) => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <Text>{item.label}</Text>
              <Progress
                percent={(item.actual / item.objetivo) * 100}
                showInfo={false}
                strokeColor="#52c41a"
                strokeWidth={6}
              />
            </div>
          ))}
        </Panel>
      </Collapse>
    </Card>
  );
};

export default MicronutrientsCard;
