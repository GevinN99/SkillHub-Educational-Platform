import React, { useState } from "react";
import { Layout, Menu, message } from "antd";
import {
  BellOutlined,
  BookOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import LearnerProfile from "../Components/LearnerProfile";
import LearnerMyCourses from "../Components/LearnerMyCourses";
import LearnerAllCourses from "../Components/LearnerAllCourses";
import LearnerCart from "../Components/LearnerCart";
import LearnerTickets from "../Components/LearnerTicket";
const { Header, Sider, Content } = Layout;

const LearnerHome = ({ collapsed, onCollapse, onSelectMenuItem }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("learnerId");
    message.success("Logged out successfully");
    navigate("/login");
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
        defaultSelectedKeys={["1"]}
        onSelect={onSelectMenuItem}
      >
        <Menu.Item key="1" icon={<BookOutlined />}>
          All Courses
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />}>
          My Courses
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Profile
        </Menu.Item>
        <hr style={{ marginTop: "30px", color: "white" }} />

        <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
          Cart
        </Menu.Item>

        <Menu.Item key="5" icon={<BookOutlined />}>
          My Tickets
        </Menu.Item>

        <hr style={{ marginTop: "20px", color: "white" }} />
        <Menu.Item
          key="6"
          style={{ marginTop: "30px" }}
          icon={<LogoutOutlined style={{ color: "orangered" }} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");

  const handleSelectMenuItem = ({ item, key }) => {
    setSelectedMenuItem(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <LearnerHome
        collapsed={collapsed}
        onSelectMenuItem={handleSelectMenuItem}
      />
      <Layout>
        <Header
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "white",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <h4 style={{ color: "white", fontFamily: "cursive" }}>
            S k i l l H u b
          </h4>

          <button
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "white",
            }}
            type="button"
          >
            <BellOutlined style={{ fontWeight: "bold", fontSize: "20px" }} />
          </button>
        </Header>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          {selectedMenuItem === "1" && <LearnerAllCourses />}
          {selectedMenuItem === "2" && <LearnerMyCourses />}
          {selectedMenuItem === "3" && <LearnerProfile />}
          {selectedMenuItem === "4" && <LearnerCart />}
          {selectedMenuItem === "5" && <LearnerTickets />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
