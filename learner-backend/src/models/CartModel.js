const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Learner",
        required: true,
    },
    courses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            price: {
                type: Number
            },
        },
    ],
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    }
});

module.exports = mongoose.model("Cart", CartSchema);
