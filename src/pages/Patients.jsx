import { Button, Empty, Flex, Input, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getMyPatients } from '../api/patient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

export function Patients() {
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const { user } = useAuth()
    const navigate = useNavigate();

    const handleSendMessage = (idPatient) => {
        navigate(`/chat?target=${idPatient}`);
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Apellido',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={()=>handleSendMessage(record.key)}>
                        Enviar mensaje
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getMyPatients(user.id)
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    name: item.name,
                    lastname: item.lastname,
                }));
                setPatients(mappedData);
            })
            .catch((error) => {
                console.error("Error al obtener los pacientes:", error);
            });
    }, []);

    const filteredPatients = patients.filter((p) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
            p.name.toLowerCase().includes(searchLower) ||
            p.lastname.toLowerCase().includes(searchLower);
        return matchesSearch;
    });

    return (
        <div>
            <Typography.Title level={2}>Pacientes</Typography.Title>

            <Flex align="center" gap="large" style={{ marginBottom: 20 }}>
                <Search
                    placeholder="Buscar paciente"
                    enterButton="Buscar"
                    size="large"
                    onSearch={value => setSearch(value)}
                    allowClear
                    style={{ flex: 1 }}
                />
            </Flex>

            <Table
                dataSource={filteredPatients}
                columns={columns}
                rowKey="key"
                locale={{ emptyText: <Empty description="No se encontraron pacientes." /> }}
            />
        </div>
    );
}
