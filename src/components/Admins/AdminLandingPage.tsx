import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import cnscLogo from "../../assets/cnsc_logo.png";

const AdminLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  
    console.log("Logged out");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-red-900 flex justify-between items-center px-4 h-auto">
        <div className="flex items-center">
          <img
            src={cnscLogo}
            alt="Logo"
            className="h-16 w-16 object-contain p-2"
          />
          <div className="flex flex-col justify-center">
            <h1
              className="text-white text-sm sm:text-sm md:text-sm lg:text-xm font-bold"
              style={{ borderBottom: "2px solid gold" }}
            >
              Camarines Norte State College
            </h1>
            <h1 className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">
              Client Feedback System
            </h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-300 font-bold ml-auto"
        >
          Logout
        </button>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
};

export default AdminLandingPage;
