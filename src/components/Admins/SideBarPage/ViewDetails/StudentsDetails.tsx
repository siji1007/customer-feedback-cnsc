import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart';
import PieChart from '../PieChart';
import axios from 'axios';
import hosting from "../../../../hostingport.txt?raw";

const StudentDetails: React.FC = () => {
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const serverUrl = hosting.trim();
  //const [studentData, setStudentData] = useState<[]>([]);
  const [pieLabels, setPieLabels] = useState<string[]>([]);
  const [pieData, setPieData] = useState<[]>([]);
  const [studentData, setStudentData] = useState<string[]>([]);

  const students = [
    { id: '12345', name: 'Christian John Ibanez', block: 'A', year: '2nd Year',program:'BSIT', result: 'Passed' },
    { id: '67890', name: 'Gerry Vien Flores', block: 'B', year: '3rd Year',program:'BSIT', result: 'Failed' },   //test lng 

  ];
  

  const fetchAcadYears = async () => {
    try {
      const response = await axios.get(serverUrl + "/get_acad_years");
      setAcadYears(response.data);
    } catch (error) {
      console.error("Error fetching academic years: ", error);
    }
  };

  const fetchPie = async() => {
    try{
      const response = await axios.post(serverUrl + "/fetch_users", {type: "student"});
      setPieLabels(response.data.labels);
      setPieData(response.data.user_counts);
    }catch(error){
      console.error("Error fetching graph data: ", error)
    }
  }

  const fetchBar = async() => {
    try{
      const response = await axios.post(serverUrl + "/fetch_specific_type", {type: "student"});
      setStudentData(response.data);
    }catch(error){
      console.error("Error fetching graph data: ", error);
    }
  }

  useEffect(() => {
    fetchAcadYears();
    fetchPie();
    fetchBar();
  }, []);

  const getStudentBarChartData = () => {
    const labels = ["Needs Improvement", "Failed to Meet Expectations", "Meet Expectations", "Exceeds Expectations", "Outstanding"];
    const backgroundColors = ['#7F0000', '#ff0000', '#ffff00', '#00ff00', '#004C00'];
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


      <div className="flex-1 p-2 overflow-y-auto max-h-screen mb-[10%]">
      Fliter by program
      <h1 className="text-2xl font-bold mb-4">Student Information</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Student ID</th>
            <th className="px-4 py-2 border">Student Name</th>
            <th className="px-4 py-2 border">Block</th>
            <th className="px-4 py-2 border">Year Level</th>
            <th className="px-4 py-2 border">Program</th>
            <th className="px-4 py-2 border">Responses</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{student.id}</td>
              <td className="px-4 py-2 border">{student.name}</td>
              <td className="px-4 py-2 border">{student.block}</td>
              <td className="px-4 py-2 border">{student.year}</td>
              <td className="px-4 py-2 border">{student.program}</td>
              <td className="px-4 py-2 border">{student.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default StudentDetails;
