import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, Alert, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const InstructorCoursePage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form] = Form.useForm();

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8072/api/instructor/course/${courseId}`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch course details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);


    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('file', values.file[0]);

            const response = await axios.post(`http://localhost:8072/api/instructor/course/${courseId}/content`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            setLoading(false);
            message.success('Content added successfully!');
            fetchCourseDetails();
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Failed to add content. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <center><Spin size="large" /></center>
                ) : error ? (
                    <Alert message={error} type="error" />
                ) : (
                    <Card
                        title={course.title}
                        style={{ width: '100%' }}
                    >
                        <p><strong>Description:</strong> {course.description}</p>
                        <p><strong>Requirements:</strong> {course.requirements}</p>
                        <p><strong>Price:</strong> {course.price}</p>
                        <h2>Course Content</h2>
                        {course.content.map((contentItem, index) => (
                            <div key={index}>
                                <p><strong>Title:</strong> {contentItem.title}</p>
                                <p><strong>Type:</strong> {contentItem.doc_type}</p>
                                <p><strong>URL:</strong> <a href={contentItem.url}>{contentItem.url}</a></p>
                                <hr />
                            </div>
                        ))}
                        <h2>Add New Content</h2>
                        <Form name="addContentForm" form={form} onFinish={onFinish}>
                            <Form.Item
                                name="title"
                                rules={[{ required: true, message: 'Please enter the title of the content!' }]}
                            >
                                <Input placeholder="Content Title" />
                            </Form.Item>
                            <Form.Item
                                name="file"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => e.fileList}
                                rules={[{ required: true, message: 'Please upload a file!' }]}
                            >
                                <Upload name="file" maxCount={1} beforeUpload={() => false}>
                                    <Button icon={<UploadOutlined />}>Select File</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>Add Content</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default InstructorCoursePage;
