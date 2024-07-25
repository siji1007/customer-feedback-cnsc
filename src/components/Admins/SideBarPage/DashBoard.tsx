import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from 'react-chartjs-2';
import { FaThumbsUp } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const [content, setContent] = useState(''); // State to manage main content

  const renderContent = () => {
    switch (content) {
      case 'Students':
        return <div>Students Content</div>;
      case 'Employee':
        return <div>Employee Content</div>;
      case 'Others Customer':
        return <div>Others Customer Content</div>;
      case 'Research':
        return <div>Research Content</div>;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(serverUrl + "service_department");
        setDepartments(response.data.departments);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    const fetchAcadYears = async () => {
      try {
        const response = await axios.get(serverUrl + "get_acad_years");
        setAcadYears(response.data);
      } catch (error) {
        console.error("Error fetching semesters: ", error);
      }
    };

    fetchAcadYears();
    fetchDepartments();
  }, []);

  

  return (
    <div>


      <main className="px-4">
        {!showDetailedView ? (
          <>
      <header className="w-full border-b pb-4 mb-4 flex items-center justify-between bg-red-900 p-2 rounded-lg">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="selectAll"
            className="mr-2 h-5 w-5"
          />
          <label htmlFor="selectAll" className="text-lg text-white font-bold">
            All
          </label>
        </div>

        <div className="ml-auto relative">
          <label
            htmlFor="officeSelect"
            className="text-lg text-white font-bold mr-2"
          >
            Select Office
          </label>
          <select
            id="officeSelect"
            className="bg-white-100 text-black border border-gray-600 rounded-md py-1 px-2"
          >
            <option value=""></option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department} Office
              </option>
            ))}
          </select>
        </div>

        <div className="ml-10 flex flex-col">
          <div>
            <label
              htmlFor="semesterSelect"
              className="text-sm text-white font-bold mr-2"
            >
              Semester
            </label>
            <select
              id="semesterSelect"
              className="bg-white-100 text-black border border-gray-600"
            >
              <option value=""></option>
              <option value="first">First Semester</option>
              <option value="second">Second Semester</option>
            </select>
          </div>
          <div className="mt-2">
            <label
              htmlFor="academicYearSelect"
              className="text-sm text-white font-bold mr-2"
            >
              Academic Year
            </label>
            <select
              id="academicYearSelect"
              className="bg-white-100 text-black border border-gray-600 text-sm ml-5"
            >
              <option value=""></option>
              {acadYears.map((acadYear) => (
                <option key={acadYear} value={acadYear}>
                  {acadYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>


            <div className="flex justify-between mb-4">
              <h1 className="text-xl font-bold">Overview Of Result</h1>
              <div className="text-right">
                <p className="text-lg font-bold">Total Feedback</p>
                {/* Total Feedback content here */}
              </div>
            </div>
            <section className="text-center">
              Insights
            </section>
            <div className="flex justify-between">
              <div className="w-1/2 border p-4 mr-2">
                <p>Bar Graph</p>
              </div>
              <div className="w-1/2 border p-4 ml-2">
                <p>Pie Graph</p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetailedView(true)}
                className="text-center"
              >
                View Detailed Result
              </button>
            </div>
          </>
        ) : (
          <div className="flex min-screen">
          <div className="w-52 border-r border-gray-300 p-4">
            <button
              className="w-full py-2 px-4 mb-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setContent('Students')}
            >
              Students
            </button>
            <button
              className="w-full py-2 px-4 mb-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setContent('Employee')}
            >
              Employee
            </button>
            <button
              className="w-full py-2 px-4 mb-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setContent('Others Customer')}
            >
              Others Customer
            </button>
            <button
              className="w-full py-2 px-4 mb-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => setContent('Research')}
            >
              Research
            </button>
            <button
              className="w-full py-2 px-4 mb-2 text-left bg-gray-200 hover:bg-gray-300 rounded bottom"
              onClick={() => setShowDetailedView(false)}
            >
              Back
            </button>
          </div>
          <div className="flex-1 p-4">
            {renderContent()}
          </div>
        </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
