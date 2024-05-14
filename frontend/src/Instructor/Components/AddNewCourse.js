import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddNewCourse = () => {
    const [loading, setLoading] = useState(false);
    const [contentFields, setContentFields] = useState([{ title: '', files: [] }]);
    const navigate = useNavigate();

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleAddContent = () => {
        setContentFields([...contentFields, { title: '', files: [] }]);
    };

    const handleRemoveContent = (index) => {
        const updatedContentFields = [...contentFields];
        updatedContentFields.splice(index, 1);
        setContentFields(updatedContentFields);
    };

    const handleFileUpload = (file, index) => {
        const newContentFields = [...contentFields];
        newContentFields[index].files.push(file.originFileObj);
        setContentFields(newContentFields);
        return false; // Return false to prevent default file upload behavior
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('requirements', values.requirements);
            formData.append('price', values.price);

            contentFields.forEach((field, index) => {
                field.files.forEach((file) => {
                    formData.append(`content[${index}][title]`, field.title);
                    formData.append(`content[${index}][file]`, file);
                });
            });

            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8072/api/instructor/courses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                message.success('Course added successfully');
                navigate('/');
            } else {
                message.error('Failed to add new course. Please try again.');
            }
            console.log(message)
        } catch (error) {
            console.error('Error:', error.message);
            if (error.response) {
                message.error(error.response.data.message || 'Failed to add new course. Please try again.');
            } else {
                message.error('Failed to connect to the server. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container style={{ minHeight: '100vh' }}>
            <Row justify="center" align="middle" style={{ height: '100%' }}>
                <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                    <Card title="Add New Course" style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <Form
                            name="addCourse"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please input the title of the course!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please input the description of the course!' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Requirements"
                                name="requirements"
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: 'Please input the price of the course!' },
                                    { validator: (_, value) => {
                                            if (!isNaN(value) && parseFloat(value) >= 0) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Please input a valid price!');
                                        }}
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            {contentFields.map((content, index) => (
                                <div key={index}>
                                    <Form.Item
                                        label={`Content ${index + 1}`}
                                        name={['content', index, 'title']}
                                        rules={[{ required: true, message: 'Please input the content title!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label={`Upload Files for Content ${index + 1}`}
                                        name={['content', index, 'files']}
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e && e.fileList;
                                        }}
                                    >
                                        <Upload
                                            beforeUpload={(file) => handleFileUpload(file, index)}
                                            maxCount={3} // Adjust maxCount as needed
                                            multiple={true}
                                            listType="text"
                                            accept=".pdf,.doc,.docx,.mp4"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                    {index > 0 && (
                                        <Button type="danger" icon={<MinusCircleOutlined />} onClick={() => handleRemoveContent(index)}>
                                            Remove Content
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button type="dashed" onClick={handleAddContent} block icon={<PlusOutlined />}>
                                Add Content
                            </Button>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                    Add Course
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddNewCourse;
