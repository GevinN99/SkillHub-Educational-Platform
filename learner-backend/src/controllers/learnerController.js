const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Learner = require('../models/LearnerModel');
const { hashPassword, comparePassword, generateToken } = require('../middleware/auth');
const Enrollment = require('../models/EnrollmentModel');
const axios = require('axios');
const Cart = require('../models/CartModel');

exports.createLearner = async (req, res) => {
    try {
        const { name, email, password, description } = req.body;

        const existingLearner = await Learner.findOne({ email });
        if (existingLearner) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const newLearner = new Learner({
            name,
            email,
            password: hashedPassword,
            description
        });

        await newLearner.save();

        res.status(201).json({ message: 'Learner created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.learnerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const learner = await Learner.findOne({ email });
        if (!learner) {
            return res.status(404).json({ message: 'Learner not found' });
        }

        const passwordMatch = await comparePassword(password, learner.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(learner);

        res.status(200).json({ token, learnerId: learner._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.viewLearnerProfile = async (req, res) => {
    try {
        const learnerId = req.user.id;
        const learner = await Learner.findById(learnerId);
        if (!learner) {
            return res.status(404).json({ message: 'Learner not found' });
        }
        res.status(200).json(learner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateLearnerProfile = async (req, res) => {
    try {
        const learnerId = req.user.id;
        const { name, description } = req.body;

        const updatedLearner = await Learner.findByIdAndUpdate(
            learnerId,
            { name, description },
            { new: true }
        );

        if (!updatedLearner) {
            return res.status(404).json({ message: 'Learner not found' });
        }

        res.status(200).json({ message: 'Learner profile updated successfully', learner: updatedLearner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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

exports.getAllLearners = async (req, res) => {
    try {
        const learners = await Learner.find();
        res.status(200).json(learners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.enrollCourse = async (req, res) => {
    try {
        const { learnerId, courseId } = req.body;

        const enrollment = new Enrollment({
            learnerId,
            course: courseId,
        });

        await enrollment.save();

        res.status(200).json({ message: 'Course enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getEnrollmentsByLearnerId = async (req, res) => {
    try {
        const { learnerId } = req.params;

        const enrollments = await Enrollment.find({ learnerId });

        res.status(200).json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.unenrollCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const learnerId = req.user.id;

        await Enrollment.deleteOne({ learnerId, course: courseId });

        res.status(200).json({ message: 'Unenrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { contentId, completed } = req.body;
        const learnerId = req.user.id;

        let enrollment = await Enrollment.findOne({ learnerId });
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        let progress = enrollment.progress.find(item => item.content_id === contentId);
        if (!progress) {
            enrollment.progress.push({ content_id: contentId, completed });
        } else {
            progress.completed = completed;
        }

        await enrollment.save();

        res.status(200).json({ message: 'Progress updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteLearner = async (req, res) => {
    try {
        const { learnerId } = req.params;

        await Learner.findByIdAndDelete(learnerId);

        res.status(200).json({ message: 'Learner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getEnrollmentByCourseIdAndLearnerId = async (req, res) => {
    try {
        const { courseId, learnerId } = req.params;

        const enrollment = await Enrollment.findOne({
            course: courseId,
            learnerId: learnerId,
        });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        const progressCount = enrollment.progress.length;

        console.log("Count" + progressCount);
        res.status(200).json({ enrollment, progressCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { learnerId, courseId, title, description, price } = req.body;

        let cart = await Cart.findOne({ learnerId });

        if (!cart) {
            cart = new Cart({
                learnerId,
                courses: [],
                status: "pending"
            });
        }

        const existingCourseIndex = cart.courses.findIndex(
            course => course.courseId === courseId
        );

        if (existingCourseIndex !== -1) {
            return res.status(400).json({ message: "Course is already in the cart" });
        }

        cart.courses.push({
            courseId,
            title,
            description,
            price
        });

        await cart.save();

        res.status(200).json({ message: "Course added to cart successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllCartContents = async (req, res) => {
    try {
        const { learnerId } = req.params;
        const cartContents = await Cart.find({ learnerId });
        res.status(200).json(cartContents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeCartContent = async (req, res) => {
    try {
        const { learnerId, courseId } = req.params;
        const cart = await Cart.findOne({ learnerId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        console.log("Cart before removal:", cart);

        cart.courses = cart.courses.filter(course => String(course.courseId) !== String(courseId));

        await cart.save();

        console.log("Cart after removal:", cart);

        res.status(200).json({ message: "Course removed from cart successfully" });
    } catch (error) {
        console.error('Error removing course from cart:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
