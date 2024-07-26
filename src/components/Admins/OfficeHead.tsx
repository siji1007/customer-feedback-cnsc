import React, { useState, useEffect } from "react";
import axios from "axios";
import BarChart from './SideBarPage/BarChart';
import PieChart from './SideBarPage/PieChart';
import { FaThumbsUp } from 'react-icons/fa';

const OfficeHead: React.FC = () => {
  // Define arrays for departments and academic years
  const [departments, setDepartments] = useState<string[]>([]);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const [feedbackData, setFeedbackData] = useState([10, 81, 80, 25, 15]); // Dummy feedback data for categories
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(serverUrl + "service_department");
      setDepartments(response.data.departments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAcademicYear = async () => {
    try {
      const response = await axios.get(serverUrl + "get_acad_years");
      setAcadYears(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAcademicYear();
  });
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
    <main className="w-full m-4">
      <header className="w-full border-b pb-4 mb-4 flex items-center justify-between bg-red-900 p-4 rounded-lg">
        <div className="flex items-center">
          <input type="checkbox" id="selectAll" className="mr-2 h-5 w-5" />
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
            className="bg-white text-black border border-gray-600 rounded-md py-1 px-2"
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
              className="bg-white text-black border border-gray-600"
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
              className="bg-white text-black border border-gray-600 text-sm"
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
            <div className="flex w-full overflow-x-auto mb-4  items-center justify-center">
              <div className="w-full sm:w-1/3 border p-2 flex justify-center items-center">
                <BarChart data={getBarChartData()} />
              </div>
              <div className="w-full sm:w-1/2 border p-2 flex justify-center items-center">
                <div className="sm:w-1/3 ">
                  <PieChart data={getPieChartData()} options={getPieChartOptions()} />
                </div>
              </div>
            </div>

    </main>
  );
};

export default OfficeHead;
