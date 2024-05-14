const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LearnerSchema = new Schema({
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
    description: {
        type: String
    },
    userType: {
        type: String,
        enum: ['admin', 'instructor', 'learner'],
        default: 'learner'
    }
});

module.exports = mongoose.model('Learner', LearnerSchema);
