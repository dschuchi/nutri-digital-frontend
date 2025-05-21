import { Avatar, Button, Dropdown, Flex, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserOutlined, MoreOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { key: 'home', label: 'Home' },
        { key: 'objetivos', label: 'Objetivos' },
        { key: 'hidratacion', label: 'Hidratación' },
        { key: 'profesionales', label: 'Profesionales' }
    ];

    const moreMenuItems = [
        {
            key: 'buscar-alimento',
            label: 'Buscar alimento',
            onClick: () => navigate('/buscar-alimento')
        },
        {
            key: 'agregar-alimento',
            label: 'Cargar alimentación',
            onClick: () => navigate('/agregar-alimento')
        }
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
                            justifyContent: 'flex-end'
                        }}
                    />

                    <Dropdown
                        menu={{ items: moreMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="text" icon={<MoreOutlined />} style={{ color: 'white', fontSize: 20 }} />
                    </Dropdown>

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
            <Content style={{ flex: 1, margin: '20px' }}>
                <Outlet />
            </Content>
        </Layout>
    );
}

export default MainLayout;