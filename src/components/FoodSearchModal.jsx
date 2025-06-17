import FoodSearchContent from './FoodSearchContent';
import { Modal, Typography } from 'antd';


const FoodSearchModal = ({ open, onClose, onSelect }) => {
  const { Title } = Typography;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
      title={<Title level={4} style={{ margin: 0 }}>Buscar alimento</Title>}
      bodyStyle={{ paddingTop: 12, paddingBottom: 24, paddingLeft: 24, paddingRight: 24 }}
    >
      <FoodSearchContent onSelect={onSelect} />
    </Modal>
  );
};

export default FoodSearchModal;
