import { Typography } from 'antd';

export default function MealPlanner({ userId }) {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={4}>Próximamente...</Typography.Title>
      <Typography.Paragraph>
        Aquí podrás planificar las comidas del paciente por día de la semana y momento del día.
      </Typography.Paragraph>
    </div>
  );
}
