import { Flex, Layout, Menu } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

function MainLayout() {
    return (
        <Layout>
            <Header>
                <Flex justify="space-between">
                    <div>
                        <img src='logo-white.png' height={64}/>
                    </div>
                    <Menu
                        theme='dark'
                        mode="horizontal"
                        items={[
                            { key: '1', label: 'Home' },
                            { key: '2', label: 'About' },
                            { key: '3', label: 'Contact' }]}
                        style={{ height: 64 }}
                    />
                </Flex>
            </Header>
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
}

export default MainLayout;