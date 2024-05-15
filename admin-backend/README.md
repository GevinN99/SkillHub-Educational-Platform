## Admin Backend API Documentation

### Base URL: `http://localhost:8071/api/admin`

### 1. Admin Authentication

#### 1.1. Sign Up
- **Endpoint:** `POST /signup`
- **Description:** Create a new admin account.
- **Request Body:**
  - `name` (String, required): Name of the admin.
  - `email` (String, required): Email address of the admin.
  - `password` (String, required): Password for the admin account.
- **Response:** 
  - `message`: Success message.
  - `adminId`: ID of the created admin.
- **Error Responses:**
  - `400`: Email already exists.
  - `500`: Server Error.

#### 1.2. Log In
- **Endpoint:** `POST /login`
- **Description:** Log in an existing admin.
- **Request Body:**
  - `email` (String, required): Email address of the admin.
  - `password` (String, required): Password for the admin account.
- **Response:** 
  - `token`: JWT token for authentication.
  - `adminId`: ID of the logged-in admin.
- **Error Responses:**
  - `404`: Admin not found.
  - `401`: Invalid credentials.
  - `500`: Server Error.

### 2. Admin Profile

#### 2.1. View Profile
- **Endpoint:** `GET /profile`
- **Description:** Retrieve profile details of the logged-in admin.
- **Authorization:** JWT token required in the request header.
- **Response:** 
  - `name`: Name of the admin.
  - `email`: Email address of the admin.
- **Error Responses:**
  - `404`: Admin not found.
  - `500`: Server Error.

#### 2.2. Update Profile
- **Endpoint:** `PUT /profile`
- **Description:** Update profile details of the logged-in admin.
- **Authorization:** JWT token required in the request header.
- **Request Body:** New profile details to be updated.
- **Response:** Updated admin profile.
- **Error Responses:**
  - `404`: Admin not found.
  - `500`: Server Error.

### 3. Course Management

#### 3.1. Get All Courses
- **Endpoint:** `GET /all-courses`
- **Description:** Retrieve all courses available on the platform.
- **Authorization:** JWT token required in the request header.
- **Response:** Array of course objects.
- **Error Responses:**
  - `500`: Internal server error.

#### 3.2. Update Course Status
- **Endpoint:** `PUT /course/:courseId/status`
- **Description:** Update the status of a specific course.
- **Authorization:** JWT token required in the request header.
- **Request Body:**
  - `status` (String, required): New status for the course (`pending`, `accepted`, `rejected`).
- **Response:** Updated course object.
- **Error Responses:**
  - `400`: Invalid request data.
  - `500`: Internal server error.

### 4. Learner Management

#### 4.1. Get All Students
- **Endpoint:** `GET /all-students`
- **Description:** Retrieve all registered students on the platform.
- **Response:** Array of student objects.
- **Error Responses:**
  - `500`: Internal server error.

#### 4.2. Delete Learner
- **Endpoint:** `DELETE /learner/:learnerId`
- **Description:** Delete a specific learner from the platform.
- **Response:** Success message.
- **Error Responses:**
  - `500`: Internal server error.

---

This documentation covers all the endpoints provided by the `admin-backend` service, along with their descriptions, request/response formats, and error handling.