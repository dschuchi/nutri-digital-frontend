import { Card, Typography, Progress } from 'antd';
import WaterGlassCard from './WaterGlassCard/WaterGlassCard.jsx'

const { Title, Text } = Typography;

const WaterProgressCard = ({ consumoActual = 0, consumoObjetivo = 2000 }) => {
  const restante = Math.max(consumoObjetivo - consumoActual, 0);
  const porcentaje = Math.min((consumoActual / consumoObjetivo) * 100, 100);

  // return (
  //   <Card title="Agua" style={{ borderRadius: 12 }}>
  //     <div style={{ textAlign: 'center' }}>
  //       <Title level={2}>{consumoActual} ml</Title>
  //       <Text>{restante} ml faltan</Text>
  //       <Progress
  //         percent={porcentaje}
  //         showInfo={false}
  //         strokeColor="#1890ff"
  //         strokeWidth={8}
  //         style={{ marginTop: 12 }}
  //       />
  //     </div>
  //   </Card>
  // );
    return (
      <WaterGlassCard consumoActual={consumoActual} consumoObjetivo={consumoObjetivo}/>
    )
};

export default WaterProgressCard;