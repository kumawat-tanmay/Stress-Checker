import express from "express"
import { calculateScore, getQuestions } from "../controllers/quizController.js"

const router = express.Router()

router.get("/questions", getQuestions)

router.post("/submit", calculateScore)

export default router