import { Input, Typography, Card, Empty, Spin, Collapse, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import mfpFoodsRaw from '../data/mockFoods.json';

const { Search } = Input;
const { Panel } = Collapse;

const ITEMS_PER_BATCH = 10;

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [visibleFoods, setVisibleFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const listEndRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = mfpFoodsRaw.data || [];
      setAllFoods(data);
      setFilteredFoods(data);
      setVisibleFoods(data.slice(0, ITEMS_PER_BATCH));
      setLoading(false);
    }, 1000);
  }, []);

  const loadMore = () => {
    setVisibleFoods(prev => {
      const nextBatch = filteredFoods.slice(prev.length, prev.length + ITEMS_PER_BATCH);
      return [...prev, ...nextBatch];
    });
  };

  const onSearch = (value) => {
    const lower = value.toLowerCase();
    const filtered = allFoods.filter(food =>
      food.name.toLowerCase().includes(lower) ||
      (food.brand && food.brand.toLowerCase().includes(lower))
    );
    setFilteredFoods(filtered);
    setVisibleFoods(filtered.slice(0, ITEMS_PER_BATCH));
    setQuery(value);
  };

  // Detectar scroll hasta el final
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, {
      threshold: 1
    });

    if (listEndRef.current) {
      observer.observe(listEndRef.current);
    }

    return () => {
      if (listEndRef.current) {
        observer.unobserve(listEndRef.current);
      }
    };
  }, [filteredFoods, visibleFoods]);

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
      ) : visibleFoods.length > 0 ? (
        <>
          {visibleFoods.map(item => (
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

          <div ref={listEndRef} style={{ height: 1 }} />
        </>
      ) : (
        query && <Empty description="No se encontraron resultados" />
      )}
    </div>
  );
};

export default FoodSearch;
