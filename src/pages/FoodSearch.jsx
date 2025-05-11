import { Input, List, Typography, Card, Empty, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import mockFoods from '../data/mockFoods.json';

const { Search } = Input;
const { Option } = Select;

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [restriction, setRestriction] = useState('');

  // Simular fetch de API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAllFoods(mockFoods);
      setResults(mockFoods);
      setLoading(false);
    }, 1000); // simula 1 segundo de espera
  }, []);

  const onSearch = (value) => {
    const lowerQuery = value.toLowerCase();
    const filtered = allFoods.filter(food =>
      food.nombre.toLowerCase().includes(lowerQuery) &&
      (!typeFilter || food.tipo === typeFilter) &&
      (!restriction || food.restricciones.includes(restriction))
    );
    setResults(filtered);
    setQuery(value);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    onSearch(query);
  };

  const handleRestrictionFilter = (value) => {
    setRestriction(value);
    onSearch(query);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <Typography.Title level={3}>Información nutricional de alimentos</Typography.Title>

      <Search
        placeholder="Buscar un alimento, marca o restaurante"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={onSearch}
        style={{ marginBottom: 20 }}
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: 20 }}>
        <Select
          placeholder="Tipo de alimento"
          style={{ flex: 1 }}
          onChange={handleTypeFilter}
          allowClear
        >
          <Option value="carbohidrato">Carbohidrato</Option>
          <Option value="proteina">Proteína</Option>
          <Option value="grasa">Grasa</Option>
        </Select>

        <Select
          placeholder="Restricción"
          style={{ flex: 1 }}
          onChange={handleRestrictionFilter}
          allowClear
        >
          <Option value="vegano">Vegano</Option>
          <Option value="sin gluten">Sin gluten</Option>
          <Option value="vegetariano">Vegetariano</Option>
        </Select>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : results.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={results}
          renderItem={item => (
            <List.Item>
              <Card>
                <Typography.Text strong>{item.nombre}</Typography.Text><br />
                <Typography.Text>{item.porcion}</Typography.Text><br />
                <Typography.Text type="secondary">{item.calorias} Calorías</Typography.Text>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        query && <Empty description="No se encontraron resultados" />
      )}
    </div>
  );
};

export default FoodSearch;
