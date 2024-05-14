const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    userType: {
        type: String,
        enum: ['admin', 'instructor', 'learner'],
        default: 'admin'
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
