// components/FoodSearchModal.jsx
import { Modal } from 'antd';
import FoodSearchContent from './FoodSearchContent';

const FoodSearchModal = ({ open, onClose, onSelect }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <FoodSearchContent onSelect={onSelect} />
    </Modal>
  );
};

export default FoodSearchModal;
