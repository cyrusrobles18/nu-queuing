import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthLayout from "./components/AuthLayout";
import LoginPage from "./pages/AuthPages/LoginPage";

import LandingLayout from "./components/LandingLayout";
import HomePage from "./pages/LandingPages/HomePage";
import AboutPage from "./pages/LandingPages/AboutPage";

import KioskLayout from "./components/KioskLayout";
import KioskPage from "./pages/KioskPages/KioskPage";
import KioskDeptPage from "./pages/KioskPages/KioskDeptPage";

import DashLayout from "./components/DashLayout";
import DashPage from "./pages/DashPages/DashPage";
import DashControlPage from "./pages/DashPages/DashControlPage";
import DashUserListPage from "./pages/DashPages/DashUserListPage";

import DisplayLayout from "./components/DisplayLayout";
import DisplayPage from "./pages/DisplayPages/DisplayPage";

import NotFoundPage from "./pages/NotFoundPage";

import { QueueProvider } from "./providers/QueueProvider";
import DashWindowList from "./pages/DashPages/DashWindowList";

const routes = [
  {
    path: "/display",
    element: <DisplayLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <DisplayPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <LandingLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/kiosk",
    element: <KioskLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <KioskPage />,
      },
      {
        path: "department",
        element: <KioskDeptPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <DashPage />,
      },
      {
        path: "control",
        element: <DashControlPage />,
      },
      {
        path: "windows",
        element: <DashWindowList />,
      },
      {
        path: "users",
        element: <DashUserListPage />,
      },

      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    // <QueueProvider>
      <RouterProvider router={router} />
    // </QueueProvider>
  );
}

export default App;
