import  { createRoot } from 'react-dom/client'
import StudentPage from './StudentPage.jsx'
//import './index.css'
import { StrictMode } from 'react'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StudentPage />
    </StrictMode>
)
