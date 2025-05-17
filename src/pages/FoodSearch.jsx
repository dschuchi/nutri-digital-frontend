import { Input, Typography, Card, Empty, Spin, Collapse, Pagination, message } from 'antd';
import { useState } from 'react';
import { search } from '../api/food';

const { Search } = Input;
const { Panel } = Collapse;

const ITEMS_PER_PAGE = 10;

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const onSearch = async (value) => {
    setLoading(true);
    try {
      const response = await search(value);
      const results = response.data || [];
      setAllFoods(results);
      setQuery(value);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      message.error("Error al buscar alimentos");
    }
    setLoading(false);
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentFoods = allFoods.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <Typography.Title level={3}>Buscar alimentos</Typography.Title>

      <Search
        placeholder="Buscar por nombre o marca"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={onSearch}
        style={{ marginBottom: 20 }}
      />

      {loading ? (
        <Spin size="large" />
      ) : currentFoods.length > 0 ? (
        <>
          {currentFoods.map(item => (
            <Card key={item.id} style={{ marginBottom: 16 }}>
              <Typography.Title level={5}>{item.name} ({item.brand})</Typography.Title>
              <Typography.Text><strong>Calorías:</strong> {item.calories}</Typography.Text>

              <Collapse ghost style={{ marginTop: 12 }}>
                <Panel header="Ver información nutricional completa" key="1">
                  <Typography.Text><strong>Porción:</strong> {item.serving}</Typography.Text><br />
                  <Typography.Text><strong>Carbohidratos:</strong> {item.total_carbs}</Typography.Text><br />
                  <Typography.Text><strong>Azúcares:</strong> {item.sugars}</Typography.Text><br />
                  <Typography.Text><strong>Grasas Totales:</strong> {item.total_fat}</Typography.Text><br />
                  <Typography.Text><strong>Grasas Saturadas:</strong> {item.saturated}</Typography.Text><br />
                  <Typography.Text><strong>Grasas Trans:</strong> {item.trans}</Typography.Text><br />
                  <Typography.Text><strong>Proteínas:</strong> {item.protein}</Typography.Text><br />
                  <Typography.Text><strong>Sodio:</strong> {item.sodium}</Typography.Text><br />
                  <Typography.Text><strong>Potasio:</strong> {item.potassium}</Typography.Text><br />
                  <Typography.Text><strong>Fibra:</strong> {item.dietary_fiber}</Typography.Text><br />
                  <Typography.Text><strong>Colesterol:</strong> {item.cholesterol}</Typography.Text><br />
                  <Typography.Text><strong>Vitamina A:</strong> {item.vitamin_a}</Typography.Text><br />
                  <Typography.Text><strong>Vitamina C:</strong> {item.vitamin_c}</Typography.Text><br />
                  <Typography.Text><strong>Calcio:</strong> {item.calcium}</Typography.Text><br />
                  <Typography.Text><strong>Hierro:</strong> {item.iron}</Typography.Text><br />
                </Panel>
              </Collapse>
            </Card>
          ))}

          <Pagination
            current={currentPage}
            pageSize={ITEMS_PER_PAGE}
            total={allFoods.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: 'center', marginTop: 32 }}
          />
        </>
      ) : (
        query && <Empty description="No se encontraron resultados" />
      )}
    </div>
  );
};

export default FoodSearch;
