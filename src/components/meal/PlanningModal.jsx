import { Modal } from "antd";
import MealPlanner from "../MealPlanner";

const PlanningModal = ({ open, onClose, patientId }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
      title="Editar planificación"
    >
      <MealPlanner userId={patientId} />
    </Modal>
  );
};

export default PlanningModal;
