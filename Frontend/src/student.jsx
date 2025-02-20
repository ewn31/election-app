import  { createRoot } from 'react-dom/client'
import StudentPage from './StudentPage.jsx'
//import './index.css'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StudentPage />
    </StrictMode>
)
