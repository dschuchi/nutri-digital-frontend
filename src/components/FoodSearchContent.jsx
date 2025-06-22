import { Input, Typography, Card, Empty, Spin, Collapse, Pagination, message, Button, Select, Image, Flex } from 'antd';
import { useState, useEffect } from 'react';
import { search } from '../api/food';
import AddFoodModal from './AddFoodModal';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [foodToLoad, setFoodToLoad] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await search('');
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
              <Flex justify='space-around'>
                <div>
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

                  <Button
                    type="primary"
                    style={{ marginTop: 12 }}
                    onClick={() => {
                      if (onSelect) {
                        onSelect(item);
                      } else {
                        setFoodToLoad(item);
                        setModalVisible(true);
                      }
                    }}
                  >
                    Cargar
                  </Button>
                </div>
                <div>
                  <Image
                    width={200}
                    height={200}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                    src={item.href}
                    fallback="data:image/png;base64,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"
                  />
                </div>
              </Flex>
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

      {foodToLoad && (
        <AddFoodModal
          open={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setFoodToLoad(null);
          }}
          food={foodToLoad}
        />
      )}
    </>
  );
};

export default FoodSearchContent;
