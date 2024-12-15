import React, { useState } from 'react';
import { FaChartLine, FaPrint, FaCog, FaArrowLeft, FaBars, FaArchive, } from 'react-icons/fa';
import Dashboard from './SideBarPage/DashBoard';
import PrintReport from './SideBarPage/PrintReport';
import Settings from './SideBarPage/Settings';
import Archive from './SideBarPage/Archive';
import axios from 'axios';
import host from '../../hostingport.txt?raw';
import { useNavigate } from 'react-router-dom';
import cnscLogo from '../../assets/cnsc_logo.png';

const VPREPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const serverURL = host.trim();
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'PrintReport':
        return <PrintReport />;
      case 'Settings':
        return <Settings />;
      case 'Archive':
        return <Archive/>;
      default:
        return <Dashboard />;
    }
  };


  const handleLogout = async () => {
    try {
        // Call the logout endpoint on the server
        await axios.post(serverURL + "/logout", {}, { withCredentials: true });
        navigate('/');
        // Clear local storage and navigate to the login page
    } catch (error) {
        console.error("Logout error:", error);
    }
};

  return (
    <>
     <header className="w-full  bg-red-900 flex justify-between items-center px-4 h-auto">
        <div className="flex items-center">
        <img  src={cnscLogo} alt="Logo" className="h-16 w-16 object-contain p-2" />
          <div className=" flex flex-col justify-center">
          <h1 className="text-white text-sm sm:text-sm md:text-sm lg:text-xm font-bold "
          style={{ borderBottom: '2px solid gold' }}>
              Camarines Norte State College
          </h1>

            <h1 className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">Client Feedback System</h1>
          </div>
        </div>
        {/* Conditionally render logout button */}
    
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 font-bold ml-auto"
          >
            Logout
          </button>
    
      </header>

    <div className="flex w-full h-screen">

      {/* Sidebar */}
      <aside
        className={`bg-gray-200 p-4 space-y-4 border border-gray-500 flex-shrink-0 transition-transform duration-300 ${
          isSidebarVisible ? 'w-60 translate-x-0' : 'w-0 -translate-x-60'
        }`}
      >
        <div className="flex items-center mb-4 justify-between">
          <FaArrowLeft
            className={`w-5 h-5 text-gray-600 cursor-pointer ${!isSidebarVisible && 'hidden'}`}
            onClick={() => setIsSidebarVisible(false)}
          />
          <h1 className="text-lg font-bold text-center text-gray-800">Admin</h1>
          <div className="w-5 h-5" />
        </div>
        {isSidebarVisible && (
          <nav className="flex flex-col space-y-2">
            <button
              className={`w-full flex items-center text-left py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                activeComponent === 'Dashboard' ? 'bg-red-700 text-white' : 'bg-red-900 text-white hover:bg-red-700'
              }`}
              onClick={() => setActiveComponent('Dashboard')}
            >
              <FaChartLine className="w-5 h-5 mr-2" />
              <span className="ml-2">Dashboard</span>
            </button>
            <button
              className={`w-full flex items-center text-left py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                activeComponent === 'Settings' ? 'bg-red-700 text-white' : 'bg-red-900 text-white hover:bg-red-700'
              }`}
              onClick={() => setActiveComponent('Settings')}
            >
              <FaCog className="w-5 h-5 mr-2" />
              <span className="ml-2">Settings</span>
            </button>
            <button
              className={`w-full flex items-center text-left py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                activeComponent === 'Archive' ? 'bg-red-700 text-white' : 'bg-red-900 text-white hover:bg-red-700'
              }`}
              onClick={() => setActiveComponent('Archive')}
            >
              <FaArchive className="w-5 h-5 mr-2" />
              <span className="ml-2">Archive</span>
            </button>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300  ${isSidebarVisible ? 'ml-0' : 'ml-0'}`}>
        {!isSidebarVisible && (
          <FaBars
            className="w-7 h-7 text-gray-600 m-3 cursor-pointer top-30  fixed left-1 rounded-lg "
            onClick={() => setIsSidebarVisible(true)}
          />
        )}
          <div
            className={`m-1 ${isSidebarVisible ? 'min-auto' : 'h-full'}`}
            style={{
              maxWidth: isSidebarVisible ? 'calc(100% - 50px)' : '100%',
              height: isSidebarVisible ? 'auto' : '100%',
              boxSizing: 'border-box',
            }}
          >
            {renderComponent()}
          </div>
      </main>
    </div>
    </>
  );
};

export default VPREPage;
