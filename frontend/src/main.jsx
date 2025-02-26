import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CadastroPage from './pages/CadastroPage.jsx';
import ReservaPage from './pages/ReservaPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  
  {
    path: '/cadastro',
    element: <CadastroPage/>
  },

  {
    path: '/reservas',
    element: <ReservaPage/>
  },
  
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
