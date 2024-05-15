## Gateway Service API Documentation

### Base URL: `http://localhost:8075/api`

### 1. Learner Service Endpoints

#### 1.1. Proxy to Learner Service
- **Endpoint:** `POST /learner/*`, `GET /learner/*`, `PUT /learner/*`, `DELETE /learner/*`
- **Description:** Proxy requests to the learner service.
- **Request/Response:** Handled by the Learner Service.
- **Error Handling:** Internal Server Error (500) if proxy error occurs.

### 2. Instructor Service Endpoints

#### 2.1. Proxy to Instructor Service
- **Endpoint:** `POST /instructor/*`, `GET /instructor/*`, `PUT /instructor/*`, `DELETE /instructor/*`
- **Description:** Proxy requests to the instructor service.
- **Request/Response:** Handled by the Instructor Service.
- **Error Handling:** Internal Server Error (500) if proxy error occurs.

### 3. Admin Service Endpoints

#### 3.1. Proxy to Admin Service
- **Endpoint:** `POST /admin/*`, `GET /admin/*`, `PUT /admin/*`, `DELETE /admin/*`
- **Description:** Proxy requests to the admin service.
- **Request/Response:** Handled by the Admin Service.
- **Error Handling:** Internal Server Error (500) if proxy error occurs.
