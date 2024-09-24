const mongoose = require('mongoose')

const TaskModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default:'pending'
    },
    status: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    user: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        }
    
})

const Task = mongoose.model('Task',TaskModel);
module.exports = Task 