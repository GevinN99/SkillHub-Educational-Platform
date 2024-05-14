import React from "react";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        style={{ padding: "10px 20px" }}
      >
        <Container
          fluid
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Navbar.Brand
            href="/"
            style={{
              marginRight: "20px",
              fontSize: "24px",
              marginLeft: "20px",
            }}
          >
            SkillHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" style={{ marginRight: "20px" }}>
              <Nav.Link
                href="/login"
                className="text-light"
                style={{ marginLeft: "1200px" }}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="/signup"
                className="text-light"
                style={{ marginLeft: "10px" }}
              >
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="home-container position-relative">
        <div className="particles-container">
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: "#0038a4",
                },
                links: {
                  color: "#00d4ff",
                  distance: 150,
                  enable: true,
                  opacity: 0.3,
                  width: 0.5,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 4,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 0.5, max: 2.5 },
                },
              },
              detectRetina: true,
            }}
            className="particles-effect h-100"
          />
        </div>

        <Container className="mt-5">
          <Row>
            <Col md={6}>
              <Image src="/Design.png" alt="Home Page Image" fluid />
            </Col>
            <Col md={6} style={{ display: "flex", alignItems: "center" }}>
              <div>
                <h2
                  className="fw-bold"
                  style={{ fontSize: "32px", marginBottom: "20px" }}
                >
                  Welcome to SkillHub
                </h2>
                <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
                  Discover a world of knowledge at SkillHub. Our online platform
                  offers a vast collection of expertly curated courses across
                  diverse fields. With user-friendly interfaces, flexible
                  learning schedules, and multimedia resources, you can upskill
                  or explore new interests seamlessly. Enroll in multiple
                  courses, track your progress, and receive timely updates. Our
                  dedicated instructors and secure payment gateways ensure a
                  smooth and rewarding learning experience. Join our vibrant
                  community and unlock your potential today.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
