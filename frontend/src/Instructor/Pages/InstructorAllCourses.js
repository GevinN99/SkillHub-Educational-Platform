import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Modal, Button, Form, Input, Upload, message, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";
import ReactPlayer from 'react-player';

const GetAllCoursesByInstructorId = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [course, setCourse] = useState(null);
    const [form] = Form.useForm();
    const [fileUpload, setFileUpload] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);

    const uploadFile = async () => {
        if (!fileUpload) return Promise.reject("No file to upload");
        const fileRef = ref(storage, `/${fileUpload.name + v4()}`);
        const snapshot = await uploadBytes(fileRef, fileUpload);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    };

    useEffect(() => {
        console.log("File URL: ", fileUrl);
    }, [fileUrl]);

    useEffect(() => {
        const instructorId = localStorage.getItem('instructorId');

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://localhost:8072/api/instructor/${instructorId}/courses`);
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Failed to fetch courses');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleViewDetails = async (courseId) => {
        setSelectedCourseId(courseId);
        setModalVisible(true);
        try {
            const response = await axios.get(`http://localhost:8072/api/instructor/course/${courseId}`);
            setCourse(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch course details');
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const fileUrl = await uploadFile();

            const data = {
                title: values.title,
                file: fileUrl,
                doc_type: values.doc_type // Add doc_type field
            };

            console.log("Form Data: ", data);
            const response = await axios.post(`http://localhost:8072/api/instructor/course/${selectedCourseId}/content`, data, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            setLoading(false);
            setFileUpload(null);
            message.success(`Content added successfully! ${response.data}`);
            handleViewDetails(selectedCourseId);
        } catch (error) {
            setLoading(false);
            console.error('Error:', error.message);
            message.error('Failed to add content. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>All Courses</h1>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message={error} type="error" />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {courses.map(course => (
                        <Card
                            key={course._id}
                            title={course.title}
                            style={{ width: 300, margin: '10px', backgroundColor:
                                    course.status === 'pending' ? 'orange' :
                                        course.status === 'rejected' ? 'red' :
                                            course.status === 'accepted' ? 'green' : 'white',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer'
                            }}
                            hoverable
                            onClick={() => handleViewDetails(course._id)}
                        >
                            <p style={{ marginBottom: '10px' }}><strong>Description:</strong> {course.description}</p>
                            <p style={{ marginBottom: '10px' }}><strong>Requirements:</strong> {course.requirements}</p>
                            <p style={{ marginBottom: '10px' }}><strong>Price:</strong> {course.price}</p>
                            <p><strong>Status:</strong> {course.status}</p>
                        </Card>
                    ))}
                </div>
            )}
            <Modal
                title="Course Details"
                visible={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width="80%"
                destroyOnClose
                style={{ borderRadius: '20px' }}
                bodyStyle={{ padding: '30px' }}
            >
                {course && (
                    <div style={{ overflowY: 'auto' }}>
                        <Card
                            title={course.title}
                            style={{ width: '100%', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }} // Added border radius and shadow to card
                        >
                            <p><strong>Description:</strong> {course.description}</p>
                            <p><strong>Requirements:</strong> {course.requirements}</p>
                            <p><strong>Price:$</strong>{course.price}</p>
                            <h2>Course Content</h2>
                            {course.content.map((contentItem, index) => (
                                <div key={index}>
                                    <p><strong>Title:</strong> {contentItem.title}</p>
                                    {contentItem.doc_type === 'video' && contentItem.url && (
                                        <ReactPlayer url={contentItem.url} controls width="100%" />
                                    )}
                                    {contentItem.doc_type !== 'video' && (
                                        <p><strong>File:</strong> <a href={contentItem.url}>{contentItem.url}</a></p>
                                    )}
                                    <hr/>
                                </div>
                            ))}
                            <h2>Add New Content</h2>
                            <Form name="addContentForm" form={form} onFinish={onFinish}>
                                <Form.Item
                                    name="title"
                                    rules={[{required: true, message: 'Please enter the title of the content!'}]}
                                >
                                    <Input placeholder="Content Title"/>
                                </Form.Item>
                                <Form.Item
                                    name="doc_type"
                                    label="Content Type"
                                    rules={[{required: true, message: 'Please select the content type!'}]}
                                >
                                    <Radio.Group>
                                        <Radio.Button value="video">Video</Radio.Button>
                                        <Radio.Button value="file">File</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    name="file"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{required: true, message: 'Please upload a file!'}]}
                                >
                                    <Upload
                                        name="file"
                                        maxCount={1}
                                        accept=".pdf,.mp4"
                                        beforeUpload={(file) => {
                                            setFileUpload(file);
                                            return false;
                                        }}
                                    >
                                        <Button icon={<UploadOutlined/>}>Select File</Button>
                                    </Upload>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} >Add Content</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default GetAllCoursesByInstructorId;
