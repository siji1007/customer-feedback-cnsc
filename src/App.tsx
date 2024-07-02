
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartingPage from './components/Startingpage';
import LandingPage from './components/LandingPage';
import AdminPage from './components/AdminPage';
import './App.css';



function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<StartingPage />} />
        <Route path="/customer" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
