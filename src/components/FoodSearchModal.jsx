import { Modal, Typography } from 'antd';
import FoodSearchContent from './FoodSearchContent';

const FoodSearchModal = ({ open, onClose, onSelect }) => {
  return (
    <Modal
      title={<Typography.Title level={4}>Buscar alimentos</Typography.Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <FoodSearchContent onSelect={(item) => {
        onSelect(item);
        onClose();
      }} />
    </Modal>
  );
};

export default FoodSearchModal;