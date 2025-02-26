import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import AdminPage from './AdminPage.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  shape: {
    borderRadius: 36
  },
})




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AdminPage />
    </ThemeProvider>
  </StrictMode>,
)


