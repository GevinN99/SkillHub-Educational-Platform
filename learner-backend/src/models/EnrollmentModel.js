const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema  = new Schema({
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    progress: [{
        content_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);

