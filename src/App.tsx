import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartingPage from "./components/Startingpage";
import LandingPage from "./components/LandingPage";
import Admin from "./components/Admins/AdminLandingPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/customer" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
