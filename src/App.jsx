import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layout/Mainlayout';
import {Home,Work,Answer,Middle} from './pages/index'
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:'/work',
        element:<Work/>
      },
      {
        path:'/answer',
        element:<Answer/>
      },
      {
        path:'/middle',
        element:<Middle/>
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
