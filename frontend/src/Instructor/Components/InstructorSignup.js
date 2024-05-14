import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, Card, message } from 'antd';
import { Container } from 'react-bootstrap';

const InstructorSignup = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8072/api/instructor/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            setLoading(false);
            console.log('Signup successful!');
            message.success('Signup successful!');
            window.location.href = '/login';
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Signup failed. Please try again later.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Container>
            <Row justify="center" style={{ marginTop: '50px' }}>
                <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                    <Card title="Instructor Signup" style={{ borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input style={{ borderRadius: '8px' }} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input style={{ borderRadius: '8px' }} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password style={{ borderRadius: '8px' }} />
                            </Form.Item>

                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please input your title!' }]}
                            >
                                <Input style={{ borderRadius: '8px' }} />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: '8px', width: '100%' }}>
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default InstructorSignup;
