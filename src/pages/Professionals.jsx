import { Button, Empty, Flex, Input, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getProfessionals } from '../api/professional';
import { MailFilled, MessageOutlined, StarFilled } from '@ant-design/icons';
import { getRequestClient, sendRequest } from '../api/requestProfessional';
import { getMyProfessional } from '../api/patient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Search } = Input;
const { Option } = Select;

export function Professionals() {
    const [search, setSearch] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [professionals, setProfessionals] = useState([]);
    const [minRate, setMinRate] = useState(0);
    const [hasProfessionals, setHasProfessionals] = useState(false);
    const { user } = useAuth()

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
            dataIndex: 'rate',
            key: 'rate',
            render: (_, record) => (
                <Flex align='center' gap={'small'}>
                    <div>
                        {record.rate} / 5 <StarFilled />
                    </div>
                    <Button onClick={() => professionalReviews(record.key)}>
                        <MailFilled />
                    </Button>
                </Flex>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => handleSendRequest(record.key)}>
                    <Typography.Text>Enviar solicitud</Typography.Text>
                </Button>
            ),
        },
    ];

    const professionalReviews = (idProf) => {
        navigate(`/review/${idProf}`)
    }

    function handleSendRequest(professionalId) {
        sendRequest(professionalId)
            .then((res) => {
                // TODO podria estar mejor
                getRequestClient(user.id)
                    .then((res) => {
                        if (res.data.length > 0) {
                            setHasProfessionals(true);
                            navigate(`/chat?req=${res.data[0].id}`)
                        }
                    })
                    .catch((res) => {
                        console.error("Error fetching request client data:", res);
                    });
            })
            .catch((error) => {
                console.error("Error sending request:", error);
            });
    }

    const navigate = useNavigate()

    useEffect(() => {
        getMyProfessional(user.id)
            .then((res) => {
                if (res.data.length > 0) {
                    setHasProfessionals(true);
                    navigate('/chat')
                }
            }).catch((res) => {
                console.error("Error fetching my professional data:", res);
            });
        getRequestClient(user.id)
            .then((res) => {
                if (res.data.length > 0) {
                    setHasProfessionals(true);
                    navigate(`/chat?req=${res.data[0].id}`)
                }
            })
            .catch((res) => {
                console.error("Error fetching request client data:", res);
            });
        getProfessionals()
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    name: item.name,
                    specialty: item.specialty,
                    rate: item.rate,
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

        const matchesRate =
            minRate === null || prof.rate >= minRate;

        return matchesSearch && matchesSpecialty && matchesRate;
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
                <Select
                    placeholder="Calificación mínima"
                    allowClear
                    onChange={(value) => setMinRate(value ?? null)}
                    style={{ width: 180 }}
                >
                    {[5, 4, 3, 2, 1].map((rate) => (
                        <Option key={rate} value={rate}>
                            {rate} ★ o más
                        </Option>
                    ))}
                </Select>
            </Flex>

            <Table
                dataSource={filteredProfessionals}
                columns={columns}
                rowKey="key"
                locale={{ emptyText: <Empty description="No se encontraron profesionales." /> }}
            />
        </div>
    );
}
