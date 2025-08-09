import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Home from './components/Home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/app",
      element: <Home />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
