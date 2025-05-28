import { Button, Empty, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { approveRequest, cancelRequest, getRequestProfessional } from '../api/requestProfessional';

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
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => handleApprove(record.key)} style={{marginInline: 10}}>
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
                }));
                setPatients(mappedData);
            })
            .catch((error) => {
                console.error("Error al obtener los pacientes:", error);
            });
    }, []);

    return (
        <div>
            <Typography.Title level={2}>Solicitudes de pacientes</Typography.Title>
            <Table
                dataSource={patients}
                columns={columns}
                rowKey="key"
                locale={{ emptyText: <Empty description="No se encontraron pacientes." /> }}
            />
        </div>
    );
}