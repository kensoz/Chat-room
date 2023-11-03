// * ------------------------------
// *
// * Router
// *
// * ------------------------------

import { createHashRouter } from 'react-router-dom'
import Index from '../pages/Index'
import Sign from '../pages/Sign'
import Login from '../pages/Login'

const router = createHashRouter([
  {
    path: '/*',
    element: <Index />,
  },
  {
    path: 'Login',
    element: <Login />,
  },
  {
    path: 'Sign',
    element: <Sign />,
  },
])

export default router
