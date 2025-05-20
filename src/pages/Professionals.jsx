import { Button, Empty, Flex, Input, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getProfessionals } from '../api/professional';
import Icon, { MessageOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

export function Professionals() {
    const [search, setSearch] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [professionals, setProfessionals] = useState([]);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Especialidad',
            dataIndex: 'specialty',
            key: 'specialty',
        },
        {
            title: 'Calificaciones',
            dataIndex: 'reviews',
            key: 'reviews',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: () => (
                <Button>
                    <MessageOutlined />
                </Button>
            ),
        },
    ];

    useEffect(() => {
        getProfessionals()
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    name: item.name,
                    specialty: item.specialty,
                    reviews: item.reviews,
                }));
                setProfessionals(mappedData);
            })
            .catch((res) => {
                console.error("Error fetching professionals data:", res);
            });
    }, []);

    const specialties = [...new Set(professionals.map(p => p.specialty))];

    const filteredProfessionals = professionals.filter((prof) => {
        const matchesSearch =
            prof.name.toLowerCase().includes(search.toLowerCase()) ||
            prof.specialty.toLowerCase().includes(search.toLowerCase());
        const matchesSpecialty =
            !selectedSpecialty || prof.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div>
            <Typography.Title level={2}>Profesionales</Typography.Title>

            <Flex align='center' gap={'large'}>
                <Search
                    placeholder="Buscar profesional"
                    enterButton="Buscar"
                    size="large"
                    onSearch={(value) => setSearch(value)}
                    allowClear
                    style={{ flex: 1 }}
                />
                <Select
                    placeholder="Filtrar por especialidad"
                    allowClear
                    onChange={(value) => setSelectedSpecialty(value)}
                    style={{ width: 240 }}
                >
                    {specialties.map((spec) => (
                        <Option key={spec} value={spec}>
                            {spec}
                        </Option>
                    ))}
                </Select>
            </Flex>

            <Table
                dataSource={filteredProfessionals}
                columns={columns}
                rowKey="key"
                pagination={false}
                locale={{ emptyText: <Empty description="No se encontraron profesionales." /> }}
            />
        </div>
    );
}
