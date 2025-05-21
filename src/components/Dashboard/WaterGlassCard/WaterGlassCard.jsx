import { Card, Typography } from 'antd';
import './WaterGlassCard.css';

const WaterGlassCard = ({ consumoActual, consumoObjetivo }) => {
  const porcentaje = Math.min(100, Math.round((consumoActual / consumoObjetivo) * 100));
  const translateY = 100 - porcentaje;

  return (
    <Card title="Consumo de Agua" bordered={false} style={{ padding: '12px 16px', textAlign: 'center' }}>
      <div className="glass-container">
        <div className="glass">
          <div className="water-wrapper">
            <div
              className="water"
              style={{ transform: `translateY(${translateY}%)` }}
            />
          </div>
          <span className="percentage-label">{porcentaje}%</span>
        </div>
      </div>
      <Typography.Text>
        {consumoActual} ml / {consumoObjetivo} ml
      </Typography.Text>
    </Card>
  );
};

export default WaterGlassCard;
