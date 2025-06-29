import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Flex, Card, Layout, Alert } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const { login } = useAuth();

    const onFinish = (values) => {
        login(values.username, values.password)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                setShowError(true);
            });
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
                backgroundImage: 'url(login-background.avif)',
                backgroundRepeat: 'repeat',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backgroundBlendMode: 'overlay',
            }}
        >
            <Flex justify="center" align="center" style={{ height: '100vh' }}>
                <Card>
                    <img src='logo-fullname.png' style={{ maxWidth: 500, paddingBottom: 30 }} />
                    <Flex justify='center' align='center'>
                        <Form
                            name="login"
                            initialValues={{ remember: true }}
                            style={{ width: 250 }}
                            onFinish={onFinish}
                        >

                            {showError && (
                                <Form.Item>
                                    <Alert message="Credenciales incorrectas" type="error" showIcon closable onClose={() => setShowError(false)} />
                                </Form.Item>
                            )}

                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Ingrese su nombre de usuario' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Usuario" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Ingrese su contraseña' }]}
                            >
                                <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
                            </Form.Item>

                            <Form.Item>
                                <Button block type="primary" htmlType="submit">
                                    Ingresar
                                </Button>
                                <div style={{ marginTop: 8, textAlign: 'center' }}>
                                    ¿No tenés cuenta? <Link to="/register" >Registrate</Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Card>
            </Flex>
        </Layout>
    );
};

export default Login;
