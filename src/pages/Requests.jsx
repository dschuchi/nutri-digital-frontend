import { Button, Empty, Flex, Input, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getMyPatients } from '../api/patient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { approveRequest, cancelRequest, getRequestProfessional } from '../api/requestProfessional';

const { Search } = Input;
const { Option } = Select;

export function Requests() {
    const [patients, setPatients] = useState([]);
    const { user } = useAuth()

    function handleApprove(idRequest) {
        approveRequest(idRequest)
            .then()
            .catch((error) => {
                console.error("Error al aprobar la solicitud:", error);
            });
    }

    function handleReject(idRequest) {
        cancelRequest(idRequest)
            .then()
            .catch((error) => {
                console.error("Error al rechazar la solicitud:", error);
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
                <>
                    <Button onClick={() => handleApprove(record.key)}>
                        Aprobar
                    </Button>
                    <Button onClick={() => handleReject(record.key)}>
                        Rechazar
                    </Button>
                </>
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
    }, []);


    const statuses = [...new Set(patients.map(p => p.state).filter(Boolean))];

    const filteredPatients = patients.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || p.state === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <Typography.Title level={2}>Solicitudes de pacientes</Typography.Title>
            <Table
                dataSource={filteredPatients}
                columns={columns}
                rowKey="key"
                locale={{ emptyText: <Empty description="No se encontraron pacientes." /> }}
            />
        </div>
    );
}