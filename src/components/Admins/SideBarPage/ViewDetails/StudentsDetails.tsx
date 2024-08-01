import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart';
import PieChart from '../PieChart';
import axios from 'axios';

const StudentDetails: React.FC = () => {
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  useEffect(() => {
    const fetchAcadYears = async () => {
      try {
        const response = await axios.get(serverUrl + "get_acad_years");
        setAcadYears(response.data);
      } catch (error) {
        console.error("Error fetching academic years: ", error);
      }
    };

    fetchAcadYears();
  }, []);

  const getStudentBarChartData = () => {
    const labels = ["Needs Improvement", "Failed to Meet Expectations", "Meet Expectations", "Exceeds Expectations", "Outstanding"];
    const backgroundColors = ['#7F0000', '#ff0000', '#ffff00', '#00ff00', '#004C00'];
  
    // Example data, replace with actual data
    const studentData = [20, 30, 15, 10, 25];
  
    // Pair each data point with its label and color
    const dataWithLabels = studentData.map((value, index) => ({
      value,
      label: labels[index],
      color: backgroundColors[index],
    }));
  
    // Sort by value in descending order
    const sortedData = dataWithLabels.sort((a, b) => b.value - a.value);
  
    // Extract sorted values, labels, and colors
    const sortedLabels = sortedData.map(data => data.label);
    const sortedValues = sortedData.map(data => data.value);
    const sortedColors = sortedData.map(data => data.color);
  
    return {
      labels: sortedLabels,
      datasets: [
        {
          label: 'Student Feedback',
          data: sortedValues,
          backgroundColor: sortedColors,
          borderColor: sortedColors,
          borderWidth: 1,
        },
      ],
    };
  };
  

  const getStudentPieChartData = () => {
    const pieLabels = ['College of Engineering', 'Institute of Computer Studies', 'College of Business Administration'];
    const pieData = [35, 45, 20]; // Dummy data for pie chart, replace with actual values
    const pieColors = ['#4A90E2', '#50E3C2', '#F5A623'];
  

    return {
      labels: pieLabels,
      datasets: [
        {
          data: pieData,
          backgroundColor: pieColors,
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div>
      <header className="bg-maroon text-white p-4 bg-red-900 flex justify-between items-center">
        <div className="flex flex-col">
          <label htmlFor="semesterSelect" className="font-bold">Semester</label>
          <select id="semesterSelect" className="bg-white text-black border border-gray-600 text-xs  p-2">
            <option value="first">First Semester</option>
            <option value="second">Second Semester</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="academicYearSelect" className="font-bold">Academic Year</label>
          <select id="academicYearSelect" className="bg-white text-black border border-gray-600 text-xs p-2">
            <option value=""></option>
            {acadYears.map((acadYear) => (
              <option key={acadYear} value={acadYear}>
                {acadYear}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="p-4">
      <h1 className='font-bold text-center m-2'>Overall Students Satisfactions</h1>
        <div className="flex w-full overflow-x-auto mb-4">
          <div className="w-full sm:w-1/2 border p-2">
            <BarChart data={getStudentBarChartData()} />
          </div>
          <div className="w-full sm:w-1/2 border p-2 flex items-center justify-end">
          <div className="w-full sm:w-1/2 flex flex-row">
            <PieChart data={getStudentPieChartData()} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
