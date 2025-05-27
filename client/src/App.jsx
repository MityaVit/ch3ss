import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LearnPage from "./components/pages/learn-page/learn-page";
import AnalyticsPage from "./components/pages/analytics-page/analytics-page";
import HomePage from "./components/pages/home-page/home-page";
import GroupsPage from "./components/pages/groups-page/groups-page";
import ResetPasswordPage from "./components/pages/reset-password/reset-password.jsx";
import EmailActivationPage from "./components/pages/email-activation/email-activation.jsx";
import { Header, Profile, Title } from "./components/header/index";
import ProtectedRoute from "./components/ProtectedRoute";
import OpeningsPage from "./components/pages/openings/openings.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            <HomePage>
              <Header>
                <Title pageTitle={"home"} />
                <Profile />
              </Header>
            </HomePage>
          }
        />
        <Route
          path="/learn"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <LearnPage>
                <Header>
                  <Title pageTitle={"learn"} />
                  <Profile />
                </Header>
              </LearnPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/openings"
          element={
            <ProtectedRoute allowedRoles={["Coach"]}>
              <OpeningsPage>
                <Header>
                  <Title pageTitle={"openings"} />
                  <Profile />
                </Header>
              </OpeningsPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["Student", "Coach"]}>
              <AnalyticsPage>
                <Header>
                  <Title pageTitle={"analytics"} />
                  <Profile />
                </Header>
              </AnalyticsPage>
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute allowedRoles={["Coach", "Student"]}>
              <GroupsPage>
                <Header>
                  <Title pageTitle={"groups"} />
                  <Profile />
                </Header>
              </GroupsPage>
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/email-activation" element={<EmailActivationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
