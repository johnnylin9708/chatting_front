import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ChatPage from "pages/ChatPage";
// import HomePage from './pages/HomePage';
// import DashboardPage from './pages/DashboardPage';
// import PrivateRoute from './components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={LoginPage} />
        <Route path="/chat" Component={ChatPage} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
