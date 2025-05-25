import FoodSearchContent from '../components/FoodSearchContent';

const AddFoodEntry = () => {
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Buscá un alimento para registrar</h2>
      <FoodSearchContent />
    </div>
  );
};

export default AddFoodEntry;