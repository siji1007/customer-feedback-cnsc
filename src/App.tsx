import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import AdminLogins from "./components/Admins/AdminLandingPage";
import VPREPage from "./components/Admins/AdminMainContent";
import OfficeHead from "./components/Admins/OfficeHead";
import Error from "./components/Error";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const serverUrl = import.meta.env.VITE_APP_SERVERHOST; // Your backend URL
axios.defaults.withCredentials = true; // Make sure this is set


// Define a component for handling session check
function SessionChecker({ setShowLoginForm }: { setShowLoginForm: (show: boolean) => void }) {
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(serverUrl + "check-session", { withCredentials: true });
        if (response.status === 200) {
          setShowLoginForm(false); 
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
        <Route path="/" element={<StartingPage />} />
        <Route path="/customer" element={<LandingPage />} />
        {/* Pass showLoginForm state to AdminLogins component */}
        <Route path="/admin/*" element={<AdminLogins showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm} />}>
          <Route path="vpre" element={<VPREPage />} />
          <Route path="officehead" element={<OfficeHead />} />
          <Route path="*" element={<Error />} /> {/* Catch-all for /admin paths */}
        </Route>
        <Route path="*" element={<Error />} /> {/* Catch-all for other paths */}
      </Routes>
    </Router>
  );
}

export default App;
