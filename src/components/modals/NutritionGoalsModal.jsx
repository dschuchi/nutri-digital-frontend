import { Modal, Tabs } from 'antd';
import MacroGoals from '../goals/MacroGoals';
import MicroGoals from '../goals/MicroGoals';

const { TabPane } = Tabs;

export function NutritionGoalsModal({ open, onClose, patientId }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      title="Editar objetivos nutricionales"
    >
      <MacroGoals userId={patientId} />
    </Modal>
  );
}
