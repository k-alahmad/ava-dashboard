import React, { useEffect } from "react";
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
import PropertyPage from "./pages/PropertiesPage/PropertiesPage";
import FeedbackPage from "./pages/FeedbackPage/FeedbackPage";
import EnquiryPage from "./pages/EnquiryPage/EnquiryPage";
import MetaDataPage from "./pages/MetaDataPage/MetaDataPage";
import JobsPage from "./pages/JobsPage/JobsPage";
import ApplicationPage from "./pages/ApplicationsPage/ApplicationPage";
import ListingPage from "./pages/ListingsPage/ListingsPage";
import { useGetProfileQuery } from "./redux/auth/authApiSlice";
const App = () => {
  const { data, isSuccess } = useGetProfileQuery();

  const PermissionDenied = () => {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <div className=" h-[60%] w-[50%] bg-secondary rounded-lg shadow-2xl drop-shadow-2xl flex justify-center items-center p-[5%]">
          <p className="text-5xl font-bold text-primary text-center leading-relaxed transition-all duration-500 ease-out">
            You Don't Have Permission For This Page !
          </p>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      {/* Protected Routes */}
      {isSuccess && (
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
          <Route
            path="/roles"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Role")
                .Read == true ? (
                <RolePage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/users"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Users")
                .Read == true ? (
                <UserPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/teams"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Team")
                .Read == true ? (
                <TeamPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/address"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Address")
                .Read == true ? (
                <AddressPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/lngs"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Language"
              ).Read == true ? (
                <LNGPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/articles"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Article")
                .Read == true ? (
                <ArticlePage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/currency"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Currency"
              ).Read == true ? (
                <CurrenciesPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/unit"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Unit")
                .Read == true ? (
                <UnitsPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/developers"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Developer"
              ).Read == true ? (
                <DeveloperPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/category"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Category"
              ).Read == true ? (
                <CategoryPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/amenities"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Aminities"
              ).Read == true ? (
                <AmenityPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/announcements"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Announcement"
              ).Read == true ? (
                <AnnouncementPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/property"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Property"
              ).Read == true ? (
                <PropertyPage />
              ) : (
                <PermissionDenied />
              )
            }
          />

          <Route
            path="/guest-info"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Guest-info"
              ).Read == true ? (
                <GuestsPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route path="/personalization" element={<PersonalizationPage />} />
          <Route
            path="/feedback"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Feedback"
              ).Read == true ? (
                <FeedbackPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/enquiry"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Enquiry")
                .Read == true ? (
                <EnquiryPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/meta-data"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "meta-Data"
              ).Read == true ? (
                <MetaDataPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/jobs"
            element={
              data.Role.Role_Resources.find((x) => x.resource.Name == "Job")
                .Read == true ? (
                <JobsPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/applicants"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "Applicant"
              ).Read == true ? (
                <ApplicationPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route
            path="/list-with-us"
            element={
              data.Role.Role_Resources.find(
                (x) => x.resource.Name == "List-with-us"
              ).Read == true ? (
                <ListingPage />
              ) : (
                <PermissionDenied />
              )
            }
          />
          <Route path="*" element={<DashboardPage />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
