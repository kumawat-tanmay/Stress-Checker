import express from 'express'
import { recordMood, historyMood, clearHistory } from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';
import { suggestedSongs } from '../controllers/songController.js'

const router = express.Router()

router.post('/record', protect, recordMood)
router.get('/history', protect, historyMood)
router.delete('/clearhistory', protect, clearHistory)

router.get("/suggested-songs", protect, suggestedSongs);





export default router;