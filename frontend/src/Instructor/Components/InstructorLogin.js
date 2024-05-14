import React, {useState} from 'react';
import {Button, Card, Checkbox, Col, Form, Input, message, Row} from 'antd';
import {Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

const InstructorLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8072/api/instructor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const {token, id} = data;

            localStorage.setItem('token', token);
            localStorage.setItem('instructorId', id);

            setLoading(false);
            console.log('Login successful!');
            message.success('Login successful!');
            navigate('/instructor/home');
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Login failed. Please check your credentials and try again.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Container style={{minHeight: '100vh'}}>
            <Row justify="center" align="middle" style={{height: '100%'}}>
                <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                    <center>
                        <Card style={{fontFamily: "revert", fontSize: '30px', color: 'cadetblue'}}>Instructor
                        Login
                        </Card>
                    </center>
                    <Card style={{borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}>
                        <Form
                            name="basic"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{required: true, message: 'Please input your email!'}]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please input your password!'}]}
                            >
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" className="btn-success" htmlType="submit" loading={loading}
                                        style={{width: '100%'}}>
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InstructorLogin;
