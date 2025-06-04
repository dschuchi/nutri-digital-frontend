import { Modal } from 'antd';
import MealPlanner from '../meal/MealPlanner';

export function MealPlanModal({ open, onClose, patientId }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title="Editar planificación de comidas"
    >
      <MealPlanner userId={patientId} />
    </Modal>
  );
}
