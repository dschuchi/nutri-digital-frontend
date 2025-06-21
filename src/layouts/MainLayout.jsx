import { Avatar, Button, Dropdown, Flex, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserOutlined } from '@ant-design/icons';
import NotificationsBell from '../components/NotificationBell';

const { Header, Content } = Layout;

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { key: 'home', label: 'Inicio' },

        {
            key: 'salud',
            label: 'Salud',
            children: [
                { key: 'objetivos', label: 'Objetivos' },
                { key: 'hidratacion', label: 'Hidratación' },
                { key: 'ejercicios', label: 'Ejercicios' },
            ],
        },

        {
            key: 'alimentacion',
            label: 'Alimentación',
            children: [
                { key: 'agregar-alimento', label: 'Cargar alimentación' },
                { key: 'alimentos-consumidos', label: 'Alimentos consumidos' },
                { key: 'planificador', label: 'Planificar' },
                { key: 'nuevo-alimento', label: 'Crear alimento'}
            ],
        },

        {
            key: 'pacientes',
            label: user.professional ? 'Pacientes' : 'Profesionales',
            children: user.professional
                ? [
                    { key: 'patients', label: 'Ver pacientes' },
                    { key: 'requests', label: 'Solicitudes' },
                ]
                : [
                    { key: 'profesionales', label: 'Ver profesionales' },
                ],
        },

        { key: 'lugares', label: 'Lugares' },

        // ✅ Reportes sin submenús
        { key: 'reportes', label: 'Reportes' },
    ];

    const dropdownItems = [
        {
            key: 'logout',
            label: 'Cerrar sesión',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ height: 72 }}>
                <Flex justify="space-between" align='center'>
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
                        <img src='logo-white.png' height={64} />
                    </div>

                    <Menu
                        theme='dark'
                        mode="horizontal"
                        items={menuItems}
                        onClick={({ key }) => navigate(`/${key}`)}
                        style={{
                            height: 72,
                            lineHeight: '72px',
                            fontSize: 16,
                            flex: 1,
                            justifyContent: 'flex-end',
                            background: 'transparent',
                        }}
                    />

                    <NotificationsBell />


                    <Dropdown
                        menu={{ items: dropdownItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="text" style={{ color: 'white', marginLeft: 8 }}>
                            <Avatar icon={<UserOutlined />} />
                            {user.name}
                        </Button>
                    </Dropdown>
                </Flex>
            </Header>

            <Content style={{ flex: 1, background: '#f5f5f5' }}>
                <div
                    style={{
                        maxWidth: 1280,
                        margin: '20px auto',
                        padding: '0 16px',
                        width: '100%',
                    }}
                >
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
}

export default MainLayout;