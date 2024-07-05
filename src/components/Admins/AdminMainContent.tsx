import React, { useState } from 'react';
import { FaChartLine, FaPrint, FaCog } from 'react-icons/fa';
import Dashboard from './SideBarPage/DashBoard';
import PrintReport from './SideBarPage/PrintReport';
import Settings from './SideBarPage/Settings';

const VPREPage: React.FC = () => {
  // State to track the active component
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'PrintReport':
        return <PrintReport />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 w-full">
      {/* Sidebar */}
      <section className="w-full lg:w-60 bg-gray-200 p-4 space-y-4 rounded-lg border border-gray-400">
        <h1 className="text-lg font-bold mb-4 text-center">Admin</h1>
        <button
          className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
          onClick={() => setActiveComponent('Dashboard')}
        >
          <FaChartLine className="w-5 h-5 mr-2" />
          <span className="ml-2">Dashboard</span>
        </button>
        <button
          className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
          onClick={() => setActiveComponent('PrintReport')}
        >
          <FaPrint className="w-5 h-5 mr-2" />
          <span className="ml-2">Print Reports</span>
        </button>
        <button
          className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
          onClick={() => setActiveComponent('Settings')}
        >
          <FaCog className="w-5 h-5 mr-2" />
          <span className="ml-2">Settings</span>
        </button>
      </section>

      {/* Main Content */}
      <div className="flex-1 pl-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default VPREPage;
