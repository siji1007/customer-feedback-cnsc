import React from 'react';
import { FaChartLine, FaPrint, FaCog } from 'react-icons/fa';

const VPREPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row p-4 w-full">
      {/* Sidebar */}
      <section className="w-full lg:w-60 bg-gray-200 p-4 space-y-4 rounded-lg border border-gray-400">
        <h1 className="text-lg font-bold mb-4 text-center">Admin</h1>
        <button className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out">
          <FaChartLine className="w-5 h-5 mr-2" />
          <span className="ml-2">Dashboard</span>
        </button>
        <button className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out">
          <FaPrint className="w-5 h-5 mr-2" />
          <span className="ml-2">Print Reports</span>
        </button>
        <button className="w-full flex items-center text-left py-2 px-4 bg-red-900 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out">
          <FaCog className="w-5 h-5 mr-2" />
          <span className="ml-2">Settings</span>
        </button>
      </section>

      {/* Main Content */}
      <div className="flex-1 pl-4">
      <header className="w-full border-b pb-4 mb-4 flex items-center justify-between bg-red-900 p-2 rounded-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              className="mr-2 h-5 w-5"
              // Add any checkbox-specific logic here
            />
            <label htmlFor="selectAll" className="text-lg text-white font-bold">All</label>
          </div>

          {/* Select box positioned to the right */}
          <div className="ml-auto relative">
            <label htmlFor="officeSelect" className="text-lg text-white font-bold mr-2">Select Office</label>
            <select id="officeSelect" className="bg-white-100 text-black border border-gray-600 rounded-md py-1 px-2">
              <option value="admission">Admission Office</option>
              <option value="guidance">Guidance Office</option>
              <option value="registrar">Registrar Office</option>
            </select>
          </div>

          {/* Semester and Academic Year selection */}
          <div className="ml-10 flex flex-col">
            <div >
              <label htmlFor="semesterSelect" className="text-sm text-white font-bold mr-2">Semester</label>
              <select id="semesterSelect" className="bg-white-100 text-black border border-gray-600  ">
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>
            <div className="mt-2">
              <label htmlFor="academicYearSelect" className="text-sm text-white font-bold mr-2">Academic Year</label>
              <select id="academicYearSelect" className="bg-white-100 text-black border border-gray-600  text-sm ml-5">
                <option value="2023-2024">2023-2024</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        </header>
        {/* Main content goes here */}

      
      </div>
    </div>
  );
};

export default VPREPage;
