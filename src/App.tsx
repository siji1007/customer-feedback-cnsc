import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import AdminLogins from "./components/Admins/AdminLandingPage";
import VPREPage from "./components/Admins/AdminMainContent"; // Import VPREPage component
import OfficeHead from "./components/Admins/OfficeHead"; // Import OfficeHead component
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
        </Route>
        {/* Add a route for handling 404 errors */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
