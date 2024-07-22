import React, { useState, useEffect } from "react";
import axios from "axios";

const OfficeHead: React.FC = () => {
  // Define arrays for departments and academic years
  const [departments, setDepartments] = useState<string[]>([]);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

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

      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Overview Of Result</h1>
        <div className="text-right">
          <p className="text-lg font-bold">Total Feedback</p>
          {/* Total Feedback content here */}
        </div>
      </div>

      <section className="text-center mb-8">
        <h2 className="text-2xl font-bold">Insights</h2>
        {/* Insights content here */}
      </section>

      <div className="flex space-x-4">
        <div className="w-1/2 border p-4 bg-gray-200">
          <p className="text-center">Bar Graph</p>
        </div>
        <div className="w-1/2 border p-4 bg-gray-200">
          <p className="text-center">Pie Graph</p>
        </div>
      </div>
    </main>
  );
};

export default OfficeHead;
