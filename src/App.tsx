import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import AdminLogins from "./components/Admins/AdminLandingPage";
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

const serverUrl = hosting.trim() 
axios.defaults.withCredentials = true; 


function SessionChecker({ setShowLoginForm }: { setShowLoginForm: (show: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(serverUrl + "/check_session", { withCredentials: true });
        if (response.status === 200) {
          setShowLoginForm(false);

          // Navigate to admin base route, not specifically to `/admin/vpre`

          localStorage.setItem('formType', 'administrator');

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
      <SessionChecker setShowLoginForm={setShowLoginForm} /> {/* Pass setShowLoginForm to handle session */}
      <Routes>

        {/* <Route path="/" element={<StartingPage />} /> */}

        <Route path="/" element={<LandingPage />} />
{/* 
        <Route path="/" element={<StartingPage />} /> */}
        <Route path="/terms-conditions" element={<TermsCondition />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        <Route path="/client" element={<LandingPage />} />
        <Route path="/student" element={<Form />} />
        {/* Pass showLoginForm state to AdminLogins component */}
        {/* <Route path="/admin/*" element={<AdminLogins showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm} />}> */}
          <Route path="/vpre" element={<VPREPage />} />
          <Route path="officehead" element={<OfficeHead />} />
          <Route path="ResearchCoordinator" element={<ResearchCoordinator />} />
          <Route path="*" element={<Error />} /> {/* Catch-all for /admin paths */}
        {/* </Route> */}
        <Route path="*" element={<Error />} /> {/* Catch-all for other paths */}
      </Routes>
    </Router>
  );
}

export default App;
