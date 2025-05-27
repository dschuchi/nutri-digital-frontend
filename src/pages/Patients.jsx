import { Button, Empty, Flex, Input, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getMyPatients } from '../api/patient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfessionals } from '../api/professional';
import { approveRequest, getRequestProfessional } from '../api/requestProfessional';

const { Search } = Input;
const { Option } = Select;

export function Patients() {
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth()


    function handleApprove(idRequest) {
        approveRequest(idRequest)
            .then()
            .catch((error) => {
                console.error("Error al aprobar la solicitud:", error);
            });
    }

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
            title: 'Estado',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => handleApprove(record.key)}>
                    Aprobar
                </Button>
            ),
        },
    ];

    useEffect(() => {
        getRequestProfessional(user.id)
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    name: item.name,
                    lastname: item.lastname,
                    state: item.state,
                }));
                setPatients(mappedData);
            })
            .catch((error) => {
                console.error("Error al obtener los pacientes:", error);
            });
        getMyPatients(user.id)
            .then((res) => {
                const mappedData = res.data.map((item) => ({
                    key: item.id,
                    name: item.name,
                    lastname: item.lastname,
                    state: item.state,
                }));
                setPatients(prevPatients => [...prevPatients, ...mappedData]);
            })
            .catch((error) => {
                console.error("Error al obtener los pacientes:", error);
            });
    }, []);


    const statuses = [...new Set(patients.map(p => p.state).filter(Boolean))];

    const filteredPatients = patients.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || p.state === statusFilter;
        return matchesSearch && matchesStatus;
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
                <Select
                    placeholder="Filtrar por estado"
                    allowClear
                    onChange={value => setStatusFilter(value)}
                    style={{ width: 200 }}
                >
                    {statuses.map(s => (
                        <Option key={s} value={s}>
                            {s}
                        </Option>
                    ))}
                </Select>
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
