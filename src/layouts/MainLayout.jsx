import { Flex, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

function MainLayout() {
    const navigate = useNavigate();

    const menuItems = [
        { key: 'home', label: 'Home' },
        { key: 'buscar-alimento', label: 'Buscar alimento' },
        { key: 'agregar-alimento', label: 'Cargar alimentacion' }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <Flex justify="space-between">
                    <div>
                        <img src='logo-white.png' height={64} />
                    </div>
                    <Menu
                        theme='dark'
                        mode="horizontal"
                        items={menuItems}
                        onClick={({ key }) => navigate(`/${key}`)}
                        style={{ height: 64 }}
                    />
                </Flex>
            </Header>
            <Content style={{ flex: 1, margin: '20px' }}>
                <Outlet />
            </Content>
        </Layout>
    );
}

export default MainLayout;
