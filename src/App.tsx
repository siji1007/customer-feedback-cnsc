import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import AdminLandingPage from "./components/Admins/AdminLandingPage";
import VPREPage from "./components/Admins/AdminMainContent";
import OfficeHead from "./components/Admins/OfficeHead";
import ResearchCoordinator from "./components/Admins/ResearchCoordinator";
import Error from "./components/Error";
import Form from './components/Logins/SurveyForm';

import PrivacyPolicy from "./components/Terms_Policy/PrivacyPolicy";
import TermsCondition from "./components/Terms_Policy/Terms_conditions";

import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import hosting from "./hostingport.txt?raw";

const serverUrl = hosting.trim();
axios.defaults.withCredentials = true;

function SessionChecker({ setShowLoginForm }: { setShowLoginForm: (show: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(serverUrl + "/check_session", { withCredentials: true });
        if (response.status === 200) {
          setShowLoginForm(false);
          localStorage.setItem("formType", "administrator");
          navigate("/admin/vpre");
        }
      } catch (error) {
        setShowLoginForm(true);
      }
    };

    checkSession();
  }, [navigate, setShowLoginForm]);

  return null;
}

function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Router>
      <SessionChecker setShowLoginForm={setShowLoginForm} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms-conditions" element={<TermsCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/survey" element={<Form />} />
        <Route path="/admin/*" element={<AdminLandingPage />}>
          {/* Use relative paths for nested routes */}
          <Route path="vpre" element={<VPREPage />} />
          <Route path="services" element={<OfficeHead />} />
          <Route path="researchcoordinator" element={<ResearchCoordinator />} />
          <Route path="*" element={<Error />} /> {/* Catch-all for /admin paths */}
        </Route>
        <Route path="*" element={<Error />} /> {/* Catch-all for other paths */}
      </Routes>
    </Router>
  );
}

export default App;
