import React, { useState } from 'react';
import { Layout, Menu, message } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    BookOutlined, HomeOutlined, BellOutlined, TeamOutlined,
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import AdminAllCourses from "../Components/AdminAllCourses";
import AdminCoursesReq from "../Components/AdminCoursesReq";
import AdminProfile from "../Components/AdminProfile";
import AdminAllStudents from "../Components/AdminAllStudents";

const { Header, Sider, Content } = Layout;

const AdminHome = ({ collapsed, onCollapse, onSelectMenuItem }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminId');
        message.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{ left: 0 }}
            className="custom-sider"
        >
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                onSelect={onSelectMenuItem}
            >
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    Course Requests
                </Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined />}>
                    All Courses
                </Menu.Item>
                <Menu.Item key="3" icon={<TeamOutlined />}>
                    All Students
                </Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined />}>
                    Profile
                </Menu.Item>
                <hr style={{marginTop:'30px', color:'white'}} />
                <Menu.Item key="5" style={{marginTop:'30px'}} icon={<LogoutOutlined style={{color:"orangered"}} />} onClick={handleLogout}>
                    Logout
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');

    const handleSelectMenuItem = ({ item, key }) => {
        setSelectedMenuItem(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminHome
                collapsed={collapsed}
                onSelectMenuItem={handleSelectMenuItem}
            />
            <Layout>
                <Header style={{ padding: 0 }}>
                    <button
                        type="button"
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </button>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    {selectedMenuItem === '1' && <AdminCoursesReq />}
                    {selectedMenuItem === '2' && <AdminAllCourses />}
                    {selectedMenuItem === '3' && <AdminAllStudents />}
                    {selectedMenuItem === '4' && <AdminProfile />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default App;
