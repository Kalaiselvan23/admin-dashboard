// src/router.tsx (or any suitable location for your routes)
import {
    createBrowserRouter,
  } from "react-router-dom";
  import Auth from "./pages/Auth";
  import Dashboard from "./pages/Dashboard";
  import DashboardLayout from "./layouts/DashboardLayout";
import Agents from './pages/Agents';
import Upload from "./pages/Upload";
import Distributed from "./pages/Distributed";
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
            path:"agents",
            element:<Agents/>
        },
        {
            path:"upload",
            element:<Upload/>
        },
        {
            path:"distributed-list",
            element:<Distributed/>
        }

      ],
    },
  ]);
  
  export default router;
  