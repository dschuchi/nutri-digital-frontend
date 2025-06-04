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
      <Tabs defaultActiveKey="macro" centered>
        <TabPane tab="Macronutrientes" key="macro">
          <MacroGoals userId={patientId} />
        </TabPane>
        <TabPane tab="Micronutrientes" key="micro">
          <MicroGoals userId={patientId} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
