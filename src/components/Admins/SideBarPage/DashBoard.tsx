// Dashboard.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import BarChart from './BarChart';
import PieChart from './PieChart';
import StudentDetails  from "./ViewDetails/StudentsDetails";
import EmployeeDetails from "./ViewDetails/EmployeeDetails";
import OthersDetails from "./ViewDetails/OthersDetails";
import ResearchDetails from './ViewDetails/ResearchDetails';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const [content, setContent] = useState(''); // State to manage main content
  const [feedbackData, setFeedbackData] = useState([10, 81, 80, 25, 15]); // Dummy feedback data for categories
  

  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const renderContent = () => {
    switch (content) {
      case 'Students':
        return (
        <StudentDetails/>
        );    
      case 'Employee':
        return (
          <EmployeeDetails/>
          ); 
      case 'Others Customer':
        return (
          <OthersDetails/>
          ); 
      case 'Research':
        return (
          <ResearchDetails/>
          ); 
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

  const getBarChartData = () => {
    const labels = ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
    const backgroundColors = ['#7F0000', '#ff0000', '#ffff00', '#00ff00', '#004C00'];

    const sortedData = feedbackData
      .map((value, index) => ({ value, label: labels[index], color: backgroundColors[index] }))
      .sort((a, b) => b.value - a.value); // Sort descending by value

    const sortedLabels = sortedData.map(data => data.label);
    const sortedValues = sortedData.map(data => data.value);
    const sortedColors = sortedData.map(data => data.color);

    return {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Feedback',
          data: sortedValues,
          backgroundColor: sortedColors,
          borderColor: sortedColors, // Border color same as background color for consistency
          borderWidth: 1, // Optional: Adjust the border width if needed
        },
      ],
    };
  };

  const getPieChartOptions = () => ({
    plugins: {
      legend: {
        position: 'left', // Position legend to the left
        labels: {
          usePointStyle: true, // Optional: Use point style for labels
        },
      },
    },
  });
  
  const getPieChartData = () => {
    const pieLabels = ['Students', 'Employee', 'Others'];
    const pieData = [35, 45, 20]; // Dummy data for pie chart, replace with actual values
    const pieColors = ['#4A90E2', '#50E3C2', '#F5A623'];
  
    return {
      label: 'Feedback',
      labels: pieLabels,
      datasets: [
        {
          data: pieData,
          backgroundColor: pieColors,
          borderColor: '#fff', // Optional: Set border color for pie segments
          borderWidth: 2, // Optional: Adjust the border width if needed
        },
      ],
    };
  };

  

  return (
    <div>
      <main className="px-4">
        {!showDetailedView ? (
          <>
            <header className="w-full border-b pb-4 mb-2 flex items-center justify-between bg-red-900 p-2 rounded-lg">
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

            <div className="flex justify-between ">
              <h1 className="text-lg font-bold m-2">Overview Of Result</h1>
              <div className="bg-gray-300 rounded-lg">
                <section className="flex items-center justify-center p-2">
                  <FaThumbsUp className="text-xl mr-2" />
                  <p className="text-xs sm:text-xs md:text-xs lg:text-xm font-bold">Total Feedback</p>
                </section>
                <p className="text-center text-xs sm:text-xs md:text-xs lg:text-xm">100</p>
              </div>
            </div>

            <section className="flex flex-col items-center justify-center text-black text-center bg-gray-300 h-[50px] w-[200px] mx-auto rounded-lg font-bold">
              Insights
            </section>

            <div className="flex w-full overflow-x-auto mb-4">
              <div className="w-full sm:w-1/2 border p-2">
                <BarChart data={getBarChartData()} />
              </div>
              <div className="w-full sm:w-1/2 border p-2 flex items-center justify-end">
                <div className="w-full sm:w-1/2 flex flex-row">
                  <PieChart data={getPieChartData()} options={getPieChartOptions()} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
            <button
                onClick={() => {
                  setShowDetailedView(true);
                  setContent('Students'); // Set content to 'Students' when toggling detailed view
                }}
                className="text-center underline"
              >
                View Detailed Result
              </button>
            </div>
          </>
        ) : (
          <div className="flex sm:h-1/2 border">
          <div className="w-52 border-r border-gray-300 p-2  flex flex-col">
            <ul className="flex-1">
              <li className="mb-2">
                <button
                  onClick={() => setContent('Students')}
                  className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === 'Students' ? 'bg-gray-300' : ''}`}
                >
                  Students
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setContent('Employee')}
                  className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === 'Employee' ? 'bg-gray-300' : ''}`}
                >
                  Employee
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setContent('Others Customer')}
                  className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === 'Others Customer' ? 'bg-gray-300' : ''}`}
                >
                  Others Customer
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setContent('Research')}
                  className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === 'Research' ? 'bg-gray-300' : ''}`}
                >
                  Research
                </button>
              </li>
              <p className="text-xs m-5 text-gray-400">Select the specific data to sort the Result of Clients</p>
            </ul>
     
            <button
              onClick={() => setShowDetailedView(false)}
              className="w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm border p-2 text-center mt-auto"
            >
              Close
            </button>
          </div>
          <div className="flex-1 p-2">
            <div className="border p-4">{renderContent()}</div>
          </div>
        </div>
        
        )}
      </main>
    </div>
  );
};

export default Dashboard;
