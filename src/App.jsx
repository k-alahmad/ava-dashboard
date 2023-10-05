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
import CurrenciesPage from "./pages/CurrenciesPage/CurrenciesPage";
import UnitsPage from "./pages/UnitsPage/UnitsPage";
import CategoryPage from "./pages/CategoriesPage/CategoriesPage";
import DeveloperPage from "./pages/DevelopersPage/DevelopersPage";
import AmenityPage from "./pages/AmenitiesPage/AmenitiesPage";
import AnnouncementPage from "./pages/AnnouncementsPage/AnnouncementsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import PersonalizationPage from "./pages/PersonalizationPage/PersonalizationPage";
import GuestsPage from "./pages/GuestInfoPage/GuestPage";
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
        <Route path="/currency" element={<CurrenciesPage />} />
        <Route path="/unit" element={<UnitsPage />} />
        <Route path="/developers" element={<DeveloperPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/amenities" element={<AmenityPage />} />
        <Route path="/announcements" element={<AnnouncementPage />} />
        <Route path="/property" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/guest-info" element={<GuestsPage />} />
        <Route path="/personalization" element={<PersonalizationPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export default App;
