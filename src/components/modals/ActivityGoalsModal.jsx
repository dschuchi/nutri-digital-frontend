import { Modal } from 'antd';
import ActivityGoals from '../goals/ActivityGoals';

export function ActivityGoalsModal({ open, onClose, patientId }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      title="Editar objetivo de actividad física"
    >
      <ActivityGoals userId={patientId} />
    </Modal>
  );
}
