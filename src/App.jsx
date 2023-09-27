import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminContainer from "./components/Layout/PageContainer";
import AdminLogin from "./pages/AdminLogin";
import Message from "./components/MessagePopUp/Message";
import RequireAuth from "./components/RequireAuth/RequireAuth";
//pages
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RolePage from "./pages/RolePage/RolePage";
import UserPage from "./pages/UserPage/UserPage";
import TeamPage from "./pages/TeamPage/TeamPage";
import LNGPage from "./pages/LanguagePage/LanguagePage";
import ArticlePage from "./pages/ArticlesPage/ArticlesPage";
import AddressPage from "./pages/AddressesPage/AddressPage";
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <AdminContainer
            children={
              <>
                <Message />
                <RequireAuth />
              </>
            }
          />
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/roles" element={<RolePage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/teams" element={<TeamPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/lngs" element={<LNGPage />} />
        <Route path="/articles" element={<ArticlePage />} />

        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export default App;
