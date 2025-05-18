import { Avatar, Button, Dropdown, Flex, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { key: 'home', label: 'Home' },
        { key: 'buscar-alimento', label: 'Buscar alimento' },
        { key: 'agregar-alimento', label: 'Cargar alimentacion' },
        { key: 'objetivos', label: 'Objetivos' }
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
                    <div>
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
                            fontSize: 16    ,
                            flex: 1,
                            justifyContent: 'flex-end'
                        }}
                    />
                    <Dropdown
                        menu={{ items: dropdownItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="text" style={{ color: 'white' }}>
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
