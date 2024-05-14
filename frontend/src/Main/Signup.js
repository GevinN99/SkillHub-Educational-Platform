import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import LearnerSignup from "../Learner/Pages/LearnerSignup";
import AdminSignup from "../Admin/Pages/AdminSignup";
import InstructorSignup from "../Instructor/Components/InstructorSignup";
import bgImg from "../assets/images/Login.jpg";
import { Link } from "react-router-dom";

export default function Signup() {
  const [activeTab, setActiveTab] = useState("learner");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="overflow-hidden">
      <div
        className="row w-100 overflow-hidden"
        style={{ backgroundColor: "#00165f", height: "60px" }}
      >
        <Link
          to="/"
          className="text-light d-flex float-start fs-3 mx-3 mt-1"
          style={{ textDecoration: "none" }}
        >
          SkillHub
        </Link>
      </div>
      <div className="row overflow-hidden">
        <div className="col-6 p-5">
          <div className="col text-center">
            <Tabs
              activeKey={activeTab}
              onSelect={handleTabChange}
              className="justify-content-center rounded-5 mt-5 m-3 mx-3"
              style={{ fontWeight: "bold" }}
            >
              <Tab
                className="rounded-5 mt-5"
                eventKey="learner"
                title="Learner"
              >
                <LearnerSignup />
              </Tab>
              <Tab eventKey="instructor" title="Instructor">
                <InstructorSignup />
              </Tab>
              <Tab eventKey="admin" title="Admin">
                <AdminSignup />
              </Tab>
            </Tabs>
            <p className="mt-3">
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className="col">
          <img
            src={bgImg}
            alt="login"
            className="img-fluid"
            style={{ marginTop: "150px" }}
          />
        </div>
      </div>
    </div>
  );
}
