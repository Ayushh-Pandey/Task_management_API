const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { createTask, getAllTasks, updateExistingTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// task CRUD operations, authenticated by the JWT_token based authorization

router.post('/addtask',authenticate,createTask);
router.get('/',authenticate,getAllTasks)
router.put('/:id',authenticate,updateExistingTask);
router.delete('/:id',authenticate,deleteTask)

module.exports = router