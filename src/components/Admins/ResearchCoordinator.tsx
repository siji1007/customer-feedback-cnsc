import React, { useState, useEffect } from "react";
import axios from "axios";
import BarChart from './SideBarPage/BarChart';
import PieChart from './SideBarPage/PieChart';
import LineChart from './SideBarPage/LineChart';
import { FaThumbsUp } from 'react-icons/fa';
import hosting from "../../hostingport.txt?raw";


const ResearchCoordinator: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [content, setContent] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chart1Type, setChart1Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("BarChart");
  const [chart2Type, setChart2Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("PieChart");

  const serverUrl = hosting.trim();

  const [activeOffice, setActiveOffice] = useState("");
  const fetchSpecificOffice = async (selectedOffice) => {
    try {
      const response = await axios.post(serverUrl + "/fetch_specific_dept", {
        selectedOffice: selectedOffice,
      });
      setDataChartLeft(response.data);
      fetchSpecificType(selectedOffice);
      setActiveOffice(selectedOffice);
      fetchSpecificTotal(selectedOffice);
      fetchSpecificInsights(selectedOffice);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSectionClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchAllOffice = (state) => {
    if (state === "on") {
      fetchChartLeft();
      fetchDataRight();
    } else {
      fetchSpecificOffice(activeOffice);
      fetchSpecificType(activeOffice);
    }
  };

  const fetchSpecificType = async (office) => {
    try {
      const response = await axios.post(
        serverUrl + "/specific_respondent_data",
        { office: office },
      );
      setChartDataRight(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTotalFeedback = async () => {
    try {
      const response = await axios.get(serverUrl + "/get_feedback_count");
      setTotalFeedback(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpecificTotal = async (office) => {
    try {
      const response = await axios.post(serverUrl + "/fetchSpecificOffice", {
        office: office,
      });
      setTotalFeedback(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await axios.get(serverUrl + "/fetchCommentSummary");
      setInsights(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpecificInsights = async (office) => {
    try {
      const response = await axios.post(serverUrl + "/fetchCommentSummary", {
        office: office,
      });
      setInsights(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fixed data for the charts
  const chartLabelsLeft = [
    "Needs Improvement",
    "Failed to Meet Expectations",
    "Meet Expectations",
    "Exceeds Expectations",
    "Outstanding",
  ]; //add here the data scale connection for leftside chart
  const [dataChartLeft, setDataChartLeft] = useState<number[]>([0, 0, 0, 0, 0]); // add here the data number leftside chart
  const fetchChartLeft = async () => {
    const response = await axios.get(serverUrl + "/response_data");
    setDataChartLeft(response.data);
  };
  const chart1Data = {
    BarChart: {
      labels: chartLabelsLeft,
      datasets: [
        {
          label: "Feedback",
          data: dataChartLeft,
          backgroundColor: [
            "#7F0000",
            "#ff0000",
            "#ffff00",
            "#00ff00",
            "#004C00",
          ],
          borderColor: ["#7F0000", "#ff0000", "#ffff00", "#00ff00", "#004C00"],
          borderWidth: 1,
        },
      ],
    },
    PieChart: {
      labels: chartLabelsLeft,
      datasets: [
        {
          data: dataChartLeft,
          backgroundColor: [
            "#7F0000",
            "#ff0000",
            "#ffff00",
            "#00ff00",
            "#004C00",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    LineChart: {
      labels: chartLabelsLeft,
      datasets: [
        {
          label: "Feedback",
          data: dataChartLeft,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    },
  };

  const chartLabelsRight = ["Students","Employee","Others"];
  const [chartDataRight, setChartDataRight] = useState<number[]>([0, 0, 0]);
  const fetchDataRight = async () => {
    try {
      const response = await axios.get(serverUrl + "/respondent_data");
      console.log(response.data);
      setChartDataRight(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const chart2Data = {
    BarChart: {
      labels: chartLabelsRight,
      datasets: [
        {
          label: "Feedback",
          data: chartDataRight,
          backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623"],
          borderColor: ["#4A90E2", "#50E3C2", "#F5A623"],
          borderWidth: 1,
        },
      ],
    },
    PieChart: {
      labels: chartLabelsRight,
      datasets: [
        {
          data: chartDataRight,
          backgroundColor: ["#4A90E2","#50E3C2", "#F5A623"],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    },
    LineChart: {
      labels: chartLabelsRight,
      datasets: [
        {
          label: "Feedback",
          data: chartDataRight,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          fill: true,
        },
      ],
    },
  };



  const fetchOffices = async () => {
    try {
      const response = await axios.get<{ offices: Office[] }>(
        serverUrl + "/office",
      );
      setOffices(response.data.offices);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  const fetchAcadYears = async () => {
    try {
      const response = await axios.get(serverUrl + "/get_acad_years");
      setAcadYears(response.data);
    } catch (error) {
      console.error("Error fetching semesters: ", error);
    }
  };

  useEffect(() => {
    fetchDataRight();
    fetchChartLeft();
    fetchAcadYears();
    fetchOffices();
    fetchTotalFeedback();
    fetchInsights();
    fetchSpecificOffice(localStorage.getItem("department"));
  }, []);

  const getChart1Data = () => chart1Data[chart1Type];
  const getChart2Data = () => chart2Data[chart2Type];

  const getPieChartOptions = () => ({
    plugins: {
      legend: {
        position: "left",
        labels: {
          usePointStyle: true,
        },
      },
    },
  });



  return (
    <main className="w-full m-4">
      <header className="w-full border-b flex items-center justify-end bg-red-900 p-2 rounded-lg ">
              <div className="ml-10 flex flex-col ">
                <div className="flex items-center">
                  <label
                    htmlFor="semesterSelect"
                    className="text-sm text-white font-bold mr-2"
                  >
                    Semester
                  </label>
                  <select
                    id="semesterSelect"
                    className="bg-white-100 text-black border border-gray-600 flex-grow w-full"
                  >
                    <option value=""></option>
                    <option value="first">First Semester</option>
                    <option value="second">Second Semester</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <label
                    htmlFor="academicYearSelect"
                    className="text-sm text-white font-bold mr-2"
                  >
                    Academic Year
                  </label>
                  <select
                    id="academicYearSelect"
                    className="bg-white-100 text-black border border-gray-600 flex-grow w-full"
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

            <div className="flex justify-between items-center mb-1">
              <h1 className="text-lg font-bold m-2">Overview Of Result</h1>

              <div className="p-1 grid grid-cols-2 items-center ">
                <div className="flex justify-center items-center">
                  <FaThumbsUp className="text-3xl text-black-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs sm:text-xs md:text-xs lg:text-xm font-bold">
                    Total Feedback
                  </p>
                  <p className="text-xl sm:text-xl md:text-xl lg:text-xl text-center">
                    {totalFeedback}
                  </p>
                </div>
              </div>
            </div>

            <section
              className="flex flex-col items-center justify-center text-black text-center bg-gray-300 h-fit w-[70vh] p-1 mb-2 mx-auto rounded-lg font-bold cursor-pointer"
              onClick={handleSectionClick}
            >
              {insights}
            </section>

            {/* Display here the top 10 bert Topic list */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Top 10 List Insight</h2>
                  <p>Display here.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-red-800 text-white rounded"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col lg:flex-row w-full overflow-x-auto mb-4 items-center justify-center">
              <div className="w-full lg:w-1/2 border p-2 flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <label
                    htmlFor="chart1Type"
                    className="text-sm font-bold mr-2"
                  >
                    Choose Visualization Type
                  </label>
                  <select
                    id="chart1Type"
                    className="bg-white border border-gray-600 rounded-md p-1"
                    value={chart1Type}
                    onChange={(e) =>
                      setChart1Type(
                        e.target.value as "BarChart" | "PieChart" | "LineChart",
                      )
                    }
                  >
                    <option value="BarChart">Bar Chart</option>
                    <option value="PieChart">Pie Chart</option>
                    <option value="LineChart">Line Chart</option>
                  </select>
                </div>
                <div className="w-full flex justify-center">
                  {chart1Type === "PieChart" && (
                    <div className="w-1/2">
                      <PieChart
                        data={getChart1Data()}
                        options={getPieChartOptions()}
                      />
                    </div>
                  )}
                  {chart1Type === "BarChart" && (
                    <BarChart data={getChart1Data()} />
                  )}
                  {chart1Type === "LineChart" && (
                    <LineChart data={getChart1Data()} />
                  )}
                </div>
              </div>

              <div className="w-full lg:w-1/2 border p-2 flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <label
                    htmlFor="chart2Type"
                    className="text-sm font-bold mr-2"
                  >
                    Choose Visualization Type
                  </label>
                  <select
                    id="chart2Type"
                    className="bg-white border border-gray-600 rounded-md p-1"
                    value={chart2Type}
                    onChange={(e) =>
                      setChart2Type(
                        e.target.value as "BarChart" | "PieChart" | "LineChart",
                      )
                    }
                  >
                    <option value="BarChart">Bar Chart</option>
                    <option value="PieChart">Pie Chart</option>
                    <option value="LineChart">Line Chart</option>
                  </select>
                </div>
                <div className="w-full flex justify-center">
                  {chart2Type === "PieChart" && (
                    <div className="w-1/2">
                      <PieChart
                        data={getChart2Data()}
                        options={getPieChartOptions()}
                      />
                    </div>
                  )}
                  {chart2Type === "BarChart" && (
                    <BarChart data={getChart2Data()} />
                  )}
                  {chart2Type === "LineChart" && (
                    <LineChart data={getChart2Data()} />
                  )}
                </div>
              </div>
            </div>
    </main>
  );
};

export default ResearchCoordinator;