# SkillHub: Educational Platform README

SkillHub is an educational platform designed to offer a wide range of courses to learners. It facilitates browsing, enrollment, and access to courses through a user-friendly web/mobile interface. This README provides an overview of the project, including its architecture, functionalities, and setup instructions.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

SkillHub is built as a microservices project using the MERN (MongoDB, Express.js, React.js, Node.js) stack along with Boostrap and antd for front-end design, and Firebase for file handling. It employs a distributed systems architecture with separate backend servers for Admin, Instructor, and Learner functionalities. Authentication is handled using JSON Web Tokens (JWT) with bcrypt encryption.

## Features

1. **Web/Mobile Interface:** A user-friendly interface allows learners to browse, enroll in, and access courses seamlessly across various devices.

2. **Course Management Service:** Instructors can add, update, and delete course information, manage course content (lecture notes, videos, quizzes), and monitor learner progress. Admins approve course content, integrate payment gateways, and handle financial transactions related to course enrollments.

3. **Learner Service:** Learners can enroll in courses, track their progress, and cancel course enrollment if needed.

4. **Multiple Course Enrollment:** Learners can enroll in multiple courses simultaneously without scheduling conflicts.

5. **Payment Integration:** Integration of payment gateways facilitates course enrollment payments. External third-party services such as Payhere are utilized in a sandbox environment for secure transactions.

## Technologies Used

- **Frontend:** React.js, Bootstrap, antd
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Handling:** Firebase
- **Authentication:** JSON Web Tokens (JWT), bcrypt

## Project Structure

```
SkillHub/
│
├── gateway/              # API Gateway
├── admin-backend/        # Admin Backend Server
├── instructor-backend/   # Instructor Backend Server
├── learner-backend/      # Learner Backend Server
└── frontend/             # React.js Frontend
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SkillHub.git
   cd SkillHub
   ```

2. Install dependencies for each service (gateway, backend servers, frontend):
   ```bash
   cd gateway
   npm install
   cd ../admin-backend
   npm install
   # Repeat for instructor-backend, learner-backend, and frontend
   ```

3. Configure environment variables:
    - Create `.env` files in each backend directory based on `.env.example` files.
    - Set up MongoDB URI, Firebase credentials, JWT secret, etc.

4. Start each service (gateway, backend servers, frontend):
   ```bash
   cd gateway
   npm start
   # Repeat for backend servers and frontend
   ```

5. Access the application at `http://localhost:3000` in your browser.

## API Documentation

Detailed API documentation is available in the respective backend directories (`admin-backend`, `instructor-backend`, `learner-backend`). Refer to the README files within those directories for API documentation.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.