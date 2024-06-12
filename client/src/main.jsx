import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserProfile from "./components/UserProfile/UserProfile.jsx";
import Layout from './components/Layout.jsx';
import Favorites from './components/UserProfile/Favorites.jsx';
import EditProfile from './components/UserProfile/EditProfile.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "summoners/eune/:gameName/:tagLine",
        element: <App />
      }
    ],
  },
  {
    path: "user-profile",
    element: <UserProfile />,
    children: [
      {
        path: "user-favorites",
        element: <Favorites />
      },
      {
        path: "edit",
        element: <EditProfile />
      }
    ]
  },
  
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
