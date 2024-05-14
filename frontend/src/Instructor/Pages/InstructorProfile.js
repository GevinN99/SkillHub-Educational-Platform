import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, message } from 'antd'; // Import Input from antd
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InstructorProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        title: '',
        newPassword: ''
    });

    useEffect(() => {
        fetchInstructorProfile();
    }, []);

    const fetchInstructorProfile = async () => {
        try {
            const instructorId = localStorage.getItem('instructorId');
            const response = await fetch(`http://localhost:8072/api/instructor/${instructorId}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            const data = await response.json();
            console.log('Fetched profile:', data);
            setProfile(data); // Update profile state with fetched data
        } catch (error) {
            console.error('Error:', error.message);
            message.error('Failed to fetch instructor profile');
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const instructorId = localStorage.getItem('instructorId');
            const response = await fetch(`http://localhost:8072/api/instructor/${instructorId}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error('Update failed');
            }
            message.success('Profile updated successfully');
            setLoading(false);
            navigate('/instructor/home');
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Failed to update profile');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    console.log('Profile state:', profile);

    return (
        <Container style={{ minHeight: '100vh' }}>
            <center>
                <h1><span className="text-danger">Instructor </span><span className="text-success"> Profile</span></h1>
            </center>
            <Card style={{ width: 600, margin: 'auto', marginTop: '50px' }}>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item label="Name" name="name">
                        <Input value={profile.name} /> {/* Use Input from antd */}
                    </Form.Item>

                    <Form.Item label="Email" name="email">
                        <Input disabled value={profile.email} /> {/* Use Input from antd */}
                    </Form.Item>

                    <Form.Item label="Title" name="title">
                        <Input value={profile.title} /> {/* Use Input from antd */}
                    </Form.Item>

                    <Form.Item label="New Password" name="newPassword">
                        <Input.Password value={profile.newPassword} /> {/* Use Input from antd */}
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Update Profile
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default InstructorProfile;
