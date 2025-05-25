import { useEffect, useState, useRef } from 'react';
import { Table, Input, Select, Slider, Typography, Empty, Row, Col } from 'antd';
import { getPlaces } from '../api/places';

const { Title } = Typography;
const { Option } = Select;

const SitesPage = () => {
  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [distanceMax, setDistanceMax] = useState(10000);
  const yaBusque = useRef(false);

  useEffect(() => {
    const fetch = async () => {
      if (yaBusque.current) return;
      yaBusque.current = true;

      try {
        console.log("1...");

        const getUserOrigin = () =>
          new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

        const position = await getUserOrigin();
        const { latitude, longitude } = position.coords;

        console.log("lat/lon:", latitude, longitude);

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        console.log("Fetching:", url);

        const res = await fetch(url, {
          headers: {
            'User-Agent': 'NutriDigital/1.0 (franz@example.com)',
          },
        });

        const geo = await res.json();
        const originAddress = geo.display_name;
        console.log("originAddress:", originAddress);

        const data = await getPlaces(originAddress);
        setPlaces(data);
      } catch (error) {
        console.warn("Fallo geolocalización o geocoding. Usando búsqueda sin origen.");
        const data = await getPlaces();
        setPlaces(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  useEffect(() => {
    let filteredData = [...places];

    if (search) {
      filteredData = filteredData.filter((place) =>
        place.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredData = filteredData.filter((place) => place.category === category);
    }

    filteredData = filteredData.filter((place) => place.distance <= distanceMax);
    filteredData.sort((a, b) => a.distance - b.distance);

    setFiltered(filteredData);
  }, [places, search, category, distanceMax]);

  const columns = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Categoría', dataIndex: 'category', key: 'category' },
    { title: 'Dirección', dataIndex: 'direction', key: 'direction' },
    {
      title: 'Distancia (m)',
      dataIndex: 'distance',
      key: 'distance',
      sorter: (a, b) => a.distance - b.distance,
    },
    {
      title: 'Link',
      dataIndex: 'href',
      key: 'href',
      render: (href) => (
        <a href={href} target="_blank" rel="noopener noreferrer">
          Ver
        </a>
      ),
    },
  ];

  const uniqueCategories = [...new Set(places.map((p) => p.category))];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Buscar Sitios de Interés</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filtrar por categoría"
            allowClear
            value={category || undefined}
            onChange={(val) => setCategory(val || '')}
            style={{ width: '100%' }}
          >
            {uniqueCategories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Slider
            min={0}
            max={10000}
            value={distanceMax}
            step={100}
            tooltip={{ formatter: (v) => `${v} m` }}
            onChange={setDistanceMax}
          />
        </Col>
      </Row>

      {filtered.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <Empty description="No se encontraron sitios cercanos" />
      )}
    </div>
  );
};

export default SitesPage;
