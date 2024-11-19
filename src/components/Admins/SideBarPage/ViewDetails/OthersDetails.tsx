import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart';
import PieChart from '../PieChart';
import axios from 'axios';

const OthersDetails: React.FC = () => {
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const [pieLabels,setPieLabels] = useState<string[]>([]);
  const [pieData, setPieData] = useState<string[]>([]);
  const [othersData, setOthersData] = useState<string[]>([]);

  const fetchAcadYears = async () => {
    try {
      const response = await axios.get(serverUrl + "get_acad_years");
      setAcadYears(response.data);
    } catch (error) {
      console.error("Error fetching academic years: ", error);
    }
  };

  const fetchPie = async() => {
    try{
      const response = await axios.get(serverUrl + "fetch_clients");
      setPieLabels(response.data.labels);
      setPieData(response.data.client_counts);
    }catch(error){
      console.error("Error fetching graph data: ", error);
    }
  }

  const fetchBar = async() => {
    try{
      const response = await axios.get(serverUrl + "fetch_client_details");
      setOthersData(response.data);
    }catch(error){
      console.error("Error fetching graph data: ", error)
    }
  }

  useEffect(() => {
    fetchAcadYears();
    fetchPie();
    fetchBar();
  }, []);

  const getOthersBarChartData = () => {
    const labels = ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'];
    const backgroundColors = ['#7F0000', '#ff0000', '#ffff00', '#00ff00', '#004C00'];
  
    // Pair each data point with its label and color
    const dataWithLabels = othersData.map((value, index) => ({
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
          label: 'Other Customer Feedback',
          data: sortedValues,
          backgroundColor: sortedColors,
          borderColor: sortedColors,
          borderWidth: 1,
        },
      ],
    };
  };
  

  const getOthersPieChartData = () => {
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
            <option value="First Semester">First Semester</option>
            <option value="Second Semester">Second Semester</option>
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
      <h1 className='font-bold text-center m-2'>Overall Customers Satisfactions</h1>
        <div className="flex w-full overflow-x-auto mb-4">
          <div className="w-full sm:w-1/2 border p-2">
            <BarChart data={getOthersBarChartData()} />
          </div>
          <div className="w-full sm:w-1/2 border p-2 flex items-center justify-end">
          <div className="w-full sm:w-1/2 flex flex-row">
            <PieChart data={getOthersPieChartData()} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default OthersDetails;
