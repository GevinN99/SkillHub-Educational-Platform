import React, { useState } from "react";
import {Form, Input, Button, message, Checkbox} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";

const LearnerLogin = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8073/api/learner/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("learnerId", data.learnerId);
                window.location.href = "/learner/home";
            } else {
                message.error(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            message.error("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container mt-5 fw-bold">
            <h2 className="mb-4">Learner Login</h2>
            <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email address!" },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button className="btn btn-primary rounded-5 p-1 fw-bold" style={{width:'150px'}} type="primary" htmlType="submit" loading={loading}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LearnerLogin;
