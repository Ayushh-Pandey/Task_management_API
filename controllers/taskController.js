const Task = require("../models/tasksSchema");

const Joi = require('joi');

const createTask = async (req, res) => {
    // input data validation using Joi
    // creating required data schema by Joi object
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().default('pending').required(),
        dueDate: Joi.date().required()
    })

    // validate function matches the req.body data with the Joi schema
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({msg:error.details[0].message});
    }

    const { title, description, status, dueDate } = req.body;

    try {
        const newTask = await Task.create({
            title: title,
            description: description,
            status: status,
            dueDate: new Date(dueDate),
            user: req.user.id,
        })

        res.status(201).json({ message: 'Task added successfully', data: newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});

        res.status(200).json({ message: 'Tasks Fetched successfully', data: tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateExistingTask = async (req, res) => {
    // input data validation using Joi
    // creating required data schema by Joi object
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().default('pending').required(),
        dueDate: Joi.date().required()
    })

    // validate function matches the req.body data with the Joi schema
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({msg:error.details[0].message});
    }
    
    const { id } = req.params
    const { title, description, status, dueDate } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title: title,
                description: description,
                status: status,
                dueDate: new Date(dueDate),
            }
        )

        res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params

    try {
        await Task.findByIdAndDelete({_id:id})

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createTask, getAllTasks, updateExistingTask, deleteTask }