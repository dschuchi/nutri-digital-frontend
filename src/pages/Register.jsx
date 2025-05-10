import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Flex, Card, Layout } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = () => {
        navigate('/');
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
                            name="register"
                            initialValues={{ remember: false }}
                            style={{ width: 250 }}
                            onFinish={onFinish}
                        >

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

                            <Form.Item
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'Confirme su contraseña' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Las contraseñas no coinciden'));
                                        },
                                    }),
                                ]}
                            >
                                <Input prefix={<LockOutlined />} type="password" placeholder="Confirme su contraseña" />
                            </Form.Item>

                            <Form.Item>
                                <Flex justify='space-between' align='center' gap='large'> 
                                    <Button type="primary" htmlType="submit" style={{ width: '50%' }}>
                                        Registrarse
                                    </Button>
                                    <Button type="default" onClick={() => navigate('/')} style={{ width: '50%' }}>
                                        Volver
                                    </Button>
                                </Flex>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Card>
            </Flex>
        </Layout>
    );
};

export default Register;