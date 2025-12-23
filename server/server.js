import express from 'express'

import cors from 'cors'
import 'dotenv/config'
import connectToDB from './config/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import quizRoutes  from './routes/quizRoutes.js'
import moodRoutes from './routes/moodRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import AIRoutes from './routes/AIRoutes.js'

const app = express()
const PORT = process.env.PORT 

app.use(express.json())
app.use(cors())
await connectToDB()

app.get('/', (req, res)=>{
    res.send('API working.... for stress reliver')
})

app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes)
app.use("/api/moodTracker", moodRoutes)
app.use("/api/taskPlanner", taskRoutes)
app.use("/api/chatBot", AIRoutes)

app.listen(PORT, ()=>{
    console.log('Server running on port '+ PORT);
})

