import express from 'express'
import {protect} from '../middleware/authMiddleware.js'
import { addTask, completeTask, deleteTask, getTasks } from '../controllers/taskController.js'

const router = express.Router()

router.post('/add', protect , addTask)
router.get('/taskList', protect, getTasks)
router.delete('/:id/delete', protect, deleteTask)
router.put("/:id/complete", protect, completeTask);

export default router