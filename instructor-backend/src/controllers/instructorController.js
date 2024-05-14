const bcrypt = require('bcrypt');
const Instructor = require('../models/InstructorModel');
const { hashPassword, generateToken, comparePassword } = require('../middleware/auth');
const Course = require('../models/CourseModel');
const fs = require('fs');
const path = require('path');

exports.signupInstructor = async (req, res) => {
    try {
        const existingInstructor = await Instructor.findOne({ email: req.body.email });
        if (existingInstructor) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await hashPassword(req.body.password);

        const newInstructor = new Instructor({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            title: req.body.title
        });

        await newInstructor.save();

        const token = generateToken(newInstructor);

        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.loginInstructor = async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ email: req.body.email });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const isValidPassword = await comparePassword(req.body.password, instructor.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(instructor);
        res.status(200).json({ token, id: instructor._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.addNewCourse = async (req, res) => {
    try {
        const { title, description, requirements, price } = req.body;
        const instructorId = req.user.id;

        const newCourse = new Course({
            title,
            description,
            requirements,
            price,
            instructor: instructorId
        });

        if (req.files) {
            const files = req.files;

            const content = [];
            for (let file of files) {
                const fileExtension = path.extname(file.originalname);
                const fileName = `${Date.now()}${fileExtension}`;
                const uploadPath = path.join(__dirname, '../uploads/', fileName);

                await file.mv(uploadPath);

                const fileUrl = `/uploads/${fileName}`;

                content.push({
                    title: file.originalname,
                    doc_type: file.mimetype.split('/')[0],
                    url: fileUrl
                });
            }

            newCourse.content = content;
        }

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllCoursesByInstructorId = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        const courses = await Course.find({ instructor: instructorId }).populate('instructor', 'name email');

        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addCourseContent = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const { title, file, doc_type } = req.body;

        if (!title || !file || !doc_type) {
            return res.status(400).json({ message: 'Title, file URL, and doc_type are required' });
        }

        course.content.push({
            title,
            url: file,
            doc_type
        });

        await course.save();

        res.status(201).json({ message: 'Content added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



exports.viewInstructorProfile = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        const instructor = await Instructor.findById(instructorId);

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        console.log('Fetched profile:', instructor);

        const { password, ...instructorData } = instructor.toObject();

        res.status(200).json(instructorData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateInstructorProfile = async (req, res) => {
    try {
        const instructorId = req.params.instructorId;
        const updatedProfile = req.body;

        const instructor = await Instructor.findByIdAndUpdate(instructorId, updatedProfile, { new: true });

        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        const { password, ...updatedData } = instructor.toObject();

        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateCourseStatus = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { status } = req.body;

        if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const course = await Course.findByIdAndUpdate(courseId, { status }, { new: true });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
