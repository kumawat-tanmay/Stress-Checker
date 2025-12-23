import React, { useContext } from 'react'
import Login from './components/Login'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './context/AppContext'
import Dashboard from './components/Dashboard'
import { Navigate, Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile'
import Assessment from './pages/Assessment'
import MoodTracker from './components/MoodTracker'
import MusicPlayer from './components/MusicPlayer'
import AddTask from './components/AddTask'
import Calender from './pages/Calender'
import TaskList from './pages/All-Task'
import Chatbot from './pages/ChatBot'

const App = () => {
  
  const {user} = useContext(AppContext)

  return (
   <>
      <ToastContainer position='top-right' />
      <Routes>
        <Route path='/' element={user ? <Dashboard/> : <Navigate to="/login" />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={user ? <Profile /> : <Navigate to='/login' />} />

        <Route path='/quiz' element={user ? <Assessment /> : <Navigate to='/login' />} />

        <Route path='/mood' element={user ? <MoodTracker /> : <Navigate to='/login' />} />
        
        <Route path='/music-player' element={user ? <MusicPlayer /> : <Navigate to='/login' />} />

        <Route path='/add-task' element={user ? <AddTask /> : <Navigate to='/login' />} />

        <Route path='/calender' element={user ? <Calender /> : <Navigate to='/login' />} />
         
        <Route path='/task-list' element={user ? <TaskList />  : <Navigate to='/login' />} />
        
        <Route path='/chatbot' element={user ? <Chatbot />  : <Navigate to='/login' />} />
      </Routes>
      
   </>
  )
}

export default App