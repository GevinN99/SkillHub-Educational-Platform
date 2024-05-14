const bcrypt = require('bcrypt');
const Admin = require('../models/AdminModel');
const { generateToken } = require('../middleware/auth');
const axios = require('axios');

exports.adminSignup = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ email: req.body.email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            userType: req.body.userType || 'admin'
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully', adminId: savedAdmin._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(admin);

        res.status(200).json({ token, adminId: admin._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8072/api/instructor/courses`);

        const courses = response.data;

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:8073/api/learner/all-learners`);

        const students = response.data;

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.viewAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            name: admin.name,
            email: admin.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.id;

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, req.body, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateCourseStatus = async (req, res) => {
    try {
        const { courseId, status } = req.body;

        if (!courseId || !status || !['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const response = await axios.put(`http://localhost:8072/api/instructor/course/${courseId}/status`, { status });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteLearner = async (req, res) => {
    try {
        const { learnerId } = req.params;

        await axios.delete(`http://localhost:8073/api/learner/${learnerId}`);

        res.status(200).json({ message: 'Learner deleted successfully' });
    } catch (error) {
        console.error(error);
        if (error.response && error.response.status) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};