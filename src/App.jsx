import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Test from './components/Test';
import Code from './components/Code';

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
      path: "/test",
      element: <Test />
    },
    {
      path: "/code",
      element: <Code />
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
