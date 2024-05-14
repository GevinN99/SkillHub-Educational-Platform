import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AdminSignup = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8071/api/admin/signup', values);
            message.success(response.data.message);
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
            message.error('Failed to create admin');
        }
        setLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="container mt-5">
            <h2>Admin Signup</h2>
            <Form
                name="admin_signup"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Signup
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminSignup;
