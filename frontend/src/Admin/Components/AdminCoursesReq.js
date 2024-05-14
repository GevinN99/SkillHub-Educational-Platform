import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminCoursesReq() {
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

    const updateCourseStatus = async (courseId, status) => {
        try {
            const response = await fetch(`http://localhost:8071/api/admin/course/${courseId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ courseId, status })
            });

            if (response.ok) {
                setCourses(prevCourses => prevCourses.map(course => {
                    if (course._id === courseId) {
                        return { ...course, status };
                    }
                    return course;
                }));
                message.success('Course status updated successfully');
            } else {
                message.error('Failed to update course status');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="row">
                <div className="container mt-5">
                    <h1>All Courses in System</h1>
                    <Spin spinning={loading}>
                        <div className="row mt-4">
                            {courses.map(course => (
                                <div key={course._id} className="col-md-4 mb-4">
                                    <Card
                                        title={course.title}
                                        style={{
                                            width: '100%',
                                            backgroundColor:
                                                course.status === 'pending' ? '#fffdaf' :
                                                    course.status === 'accepted' ? '#90EE90' :
                                                        course.status === 'rejected' ? '#FF7F7F' : ''
                                        }}
                                    >
                                        <p>{course.description}</p>
                                        <p>Price: ${course.price}</p>
                                        <Button onClick={() => updateCourseStatus(course._id, 'pending')}>Pending</Button>
                                        <Button onClick={() => updateCourseStatus(course._id, 'accepted')}>Accepted</Button>
                                        <Button onClick={() => updateCourseStatus(course._id, 'rejected')}>Rejected</Button>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </Spin>
                </div>
            </div>
        </>
    );
}
