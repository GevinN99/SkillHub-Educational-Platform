const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    userType: {
        type: String,
        enum: ['admin', 'instructor', 'learner'],
        default: 'instructor'
    }
});

module.exports = mongoose.model('Instructor', InstructorSchema);
