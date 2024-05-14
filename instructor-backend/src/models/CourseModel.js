const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    requirements: {
        type: String
    },
    price: {
        type: Number
    },
    content: [{
        title: String,
        doc_type: String,
        url: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    instructor : {
        type: Schema.Types.ObjectId,
        ref: 'Instructor'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Course', CourseSchema);
