import { Input, Typography, Card, Empty, Spin, Collapse, Pagination, message, Button, Select } from 'antd';
import { useState, useEffect } from 'react';
import { search } from '../api/food';

const { Search } = Input;
const { Panel } = Collapse;

const ITEMS_PER_PAGE = 10;

const FoodSearchContent = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedRestricciones, setSelectedRestricciones] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [restricciones, setRestricciones] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await search(''); // o usar algún valor genérico como 'a'
        const results = response.data || [];

        const uniqueTipos = [...new Set(results.map(f => f.tipo).filter(Boolean))];
        const uniqueRestricciones = [...new Set(
          results.flatMap(f => f.restricciones?.split(',').map(r => r.trim()).filter(Boolean))
        )];

        setTipos(uniqueTipos);
        setRestricciones(uniqueRestricciones);
      } catch (err) {
        console.error(err);
        message.error("Error al cargar filtros iniciales");
      }
    };

    fetchFilters();
  }, []);


  const onSearch = async (value) => {
    setLoading(true);
    try {
      const response = await search(value);
      const results = response.data || [];
      const uniqueTipos = [...new Set(results.map(f => f.tipo).filter(Boolean))];
      const uniqueRestricciones = [...new Set(
        results.flatMap(f => f.restricciones?.split(',').map(r => r.trim()).filter(Boolean))
      )];

      setAllFoods(results);
      setTipos(uniqueTipos);
      setRestricciones(uniqueRestricciones);
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

  const filteredFoods = allFoods.filter(item => {
    const matchesTipo = !selectedTipo || item.tipo === selectedTipo;

    const restriccionesArray = (item.restricciones || '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const matchesRestricciones = selectedRestricciones.length === 0 ||
      selectedRestricciones.every(sel => restriccionesArray.includes(sel));

    return matchesTipo && matchesRestricciones;
  });
  const currentFoods = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Search
        placeholder="Buscar por nombre o marca"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={onSearch}
        style={{ marginBottom: 20 }}
      />

      {(tipos.length > 0 || restricciones.length > 0) && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <Select
            placeholder="Filtrar por tipo"
            allowClear
            onChange={(value) => setSelectedTipo(value)}
            style={{ minWidth: 200 }}
          >
            {tipos.map(tipo => (
              <Select.Option key={tipo} value={tipo}>{tipo}</Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Filtrar por restricciones"
            mode="multiple"
            allowClear
            value={selectedRestricciones}
            onChange={setSelectedRestricciones}
            style={{ minWidth: 300 }}
          >
            {restricciones.map(r => (
              <Select.Option key={r} value={r}>{r}</Select.Option>
            ))}
          </Select>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Spin size="large" style={{ transform: 'scale(1.5)' }} />
        </div>
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

              {onSelect && (
                <Button
                  type="primary"
                  style={{ marginTop: 12 }}
                  onClick={() => onSelect(item)}
                >
                  Seleccionar
                </Button>
              )}
            </Card>
          ))}

          <Pagination
            current={currentPage}
            pageSize={ITEMS_PER_PAGE}
            total={filteredFoods.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: 'center', marginTop: 32 }}
          />
        </>
      ) : (
        query && <Empty description="No se encontraron resultados" />
      )}
    </>
  );
};

export default FoodSearchContent;
