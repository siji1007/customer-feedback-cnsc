import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import AdminLogins from "./components/Admins/AdminLandingPage";
import VPREPage from "./components/Admins/AdminMainContent";
import OfficeHead from "./components/Admins/OfficeHead";
import Error from "./components/Error";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/customer" element={<LandingPage />} />
     <Route path="/admin/*" element={<AdminLogins />}>
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
