import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminAllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const fetchAllCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8071/api/admin/all-courses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                message.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const acceptedCourses = courses.filter(course => course.status === 'accepted');

    return (
        <div className="container mt-5">
            <h1>Accepted Courses in System</h1>
            <Spin spinning={loading}>
                <div className="row mt-4">
                    {acceptedCourses.map(course => (
                        <div key={course._id} className="col-md-4 mb-4">
                            <Card title={course.title} style={{ width: '100%' }}>
                                <p>{course.description}</p>
                                <p>Price: ${course.price}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </Spin>
        </div>
    );
};

export default AdminAllCourses;
