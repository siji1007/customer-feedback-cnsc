import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  LineController,
} from "chart.js";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart"; // Import LineChart component
import StudentDetails from "./ViewDetails/StudentsDetails";
import EmployeeDetails from "./ViewDetails/EmployeeDetails";
import OthersDetails from "./ViewDetails/OthersDetails";
import ResearchDetails from "./ViewDetails/ResearchDetails";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
);

interface Office {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [content, setContent] = useState("");
  const [chart1Type, setChart1Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("BarChart");
  const [chart2Type, setChart2Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("PieChart");

  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const [selectedOffice, setSelectedOffice] = useState("");
  const handleOfficeSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedOffice(event.target.value);
    fetchSpecificOffice();
  };

  const fetchSpecificOffice = async () => {
    try {
      const response = await axios.post(serverUrl + "fetch_specific_dept", {
        selectedOffice: selectedOffice,
      });
      setDataChartLeft(response.data);
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
    const response = await axios.get(serverUrl + "response_data");
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

  const chartLabelsRight = ["Students", "Employee", "Others"];
  const [chartDataRight, setChartDataRight] = useState<number[]>([0, 0, 0]);
  const fetchDataRight = async () => {
    try {
      const response = await axios.get(serverUrl + "respondent_data");
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
          backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623"],
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

  const renderContent = () => {
    switch (content) {
      case "Students":
        return <StudentDetails />;
      case "Employee":
        return <EmployeeDetails />;
      case "Others Customer":
        return <OthersDetails />;
      case "Research":
        return <ResearchDetails />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await axios.get<{ offices: Office[] }>(
        serverUrl + "office",
      );
      setOffices(response.data.offices);
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

  useEffect(() => {
    fetchDataRight();
    fetchChartLeft();
    fetchAcadYears();
    fetchOffices();
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
                <label
                  htmlFor="selectAll"
                  className="text-lg text-white font-bold"
                >
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
                  value={selectedOffice}
                  onChange={handleOfficeSelection}
                >
                  <option value=""></option>
                  {offices.map((office) => (
                    <option key={office.id} value={office.name}>
                      {office.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-10 flex flex-col space-y-4">
                <div className="flex items-center">
                  <label
                    htmlFor="semesterSelect"
                    className="text-sm text-white font-bold mr-2"
                  >
                    Semester
                  </label>
                  <select
                    id="semesterSelect"
                    className="bg-white-100 text-black border border-gray-600 flex-grow"
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
                    className="bg-white-100 text-black border border-gray-600 flex-grow"
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

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold m-2">Overview Of Result</h1>
              <div className="bg-gray-300 rounded-lg flex items-center">
                <section className="flex items-center justify-center p-2">
                  <FaThumbsUp className="text-xl mr-2" />
                  <p className="text-xs sm:text-xs md:text-xs lg:text-xm font-bold">
                    Total Feedback
                  </p>
                </section>
                <p className="text-center text-xs sm:text-xs md:text-xs lg:text-xm">
                  100
                </p>
              </div>
            </div>

            <section className="flex flex-col items-center justify-center text-black text-center bg-gray-300 h-[50px] w-[200px] mx-auto rounded-lg font-bold">
              Insights
            </section>

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
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowDetailedView(true);
                  setContent("Students"); // Set content to 'Students' when toggling detailed view
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
                    onClick={() => setContent("Students")}
                    className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === "Students" ? "bg-gray-300" : ""}`}
                  >
                    Students
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    onClick={() => setContent("Employee")}
                    className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === "Employee" ? "bg-gray-300" : ""}`}
                  >
                    Employee
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    onClick={() => setContent("Others Customer")}
                    className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === "Others Customer" ? "bg-gray-300" : ""}`}
                  >
                    Others Customer
                  </button>
                </li>
                <li className="mb-2">
                  <button
                    onClick={() => setContent("Research")}
                    className={`w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm font-bold border p-2 ${content === "Research" ? "bg-gray-300" : ""}`}
                  >
                    Research
                  </button>
                </li>
                <p className="text-xs m-5 text-gray-400">
                  Select the specific data to sort the Result of Clients
                </p>
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
