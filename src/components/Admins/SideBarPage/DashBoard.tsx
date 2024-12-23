import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaThumbsUp } from "react-icons/fa";
import WordCloud from "react-wordcloud";
import hosting from "../../../hostingport.txt?raw";
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
import html2canvas from "html2canvas";
import { MdInsights } from "react-icons/md";

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
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [acadYears, setAcadYears] = useState<string[]>([]);
  const [semester, setSemester] = useState<string>("First Semester");
  const [selectedYear, setSelectedYear] = useState(acadYears[0] || "");
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [top10, setTop10] = useState<string[][]>([]);
  const [words, setWords] = useState<[]>([]);

  const options = { 
    rotations: 2,
    rotationAngles: [-90, 0],    //wala kana dito gagalawin
    fontSizes: [11, 20],
  };


  const [chart1Type, setChart1Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("BarChart");
  const [chart2Type, setChart2Type] = useState<
    "BarChart" | "PieChart" | "LineChart"
  >("PieChart");

  const serverUrl = hosting.trim();

  const [activeOffice, setActiveOffice] = useState("");
  const fetchSpecificOffice = async (selectedOffice, selectedSem, selectedAY) => {
    try {
      const response = await axios.post(serverUrl + "/fetch_specific_dept", {
        selectedOffice: selectedOffice,
      });
      setDataChartLeft(response.data);
      fetchDataRight(selectedOffice, selectedSem, selectedAY);
      setActiveOffice(selectedOffice);
      fetchSpecificTotal(selectedOffice, selectedSem, selectedAY);
      fetchTopInsights(selectedOffice, selectedSem, selectedAY);
      fetchChartLeft(selectedOffice, selectedSem, selectedAY);
      fetchTotalFeedback(selectedOffice, selectedSem, selectedAY);
      fetchWords(selectedOffice, selectedSem, selectedAY);
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
      fetchChartLeft(null, null, null);
      fetchDataRight(null,null,null);
      fetchTotalFeedback(null, null, null);
    } else {
      fetchSpecificOffice(activeOffice, semester, selectedYear);
      fetchDataRight(activeOffice, semester, selectedYear);
      fetchTotalFeedback(activeOffice, semester, selectedYear);
    }
  };

  const fetchTotalFeedback = async (office, semester, ay) => {
    try {
      if(office === null && semester === null && ay === null){
        const response = await axios.get(serverUrl + "/get_feedback_count");
        setTotalFeedback(response.data);
      }else{
        const response = await axios.post(serverUrl + "/get_feedback_count", {office: office, semester: semester, ay: ay});
        setTotalFeedback(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const fetchSpecificTotal = async (office, semester, ay) => {
    try {
      if(office === "" && semester ==="" && ay===""){
        const response = await axios.get(serverUrl + "/fetchSpecificOffice");
        setTotalFeedback(response.data);
      }else{
        const response = await axios.post(serverUrl + "/fetchSpecificOffice", {
          office: office, semester: semester, ay: ay
        });
        setTotalFeedback(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

 

  const fetchTopInsights = async (office = null, semester = null, ay = null) => {
    try{
      if(office != null && semester != null && ay != null){
        const response = await axios.post(serverUrl + "/fetchTopInsights", {
          office: office, semester: semester, ay: ay
        });
        setTop10(response.data.sc)
      }else{
        const response = await axios.get(serverUrl + "/fetchTopInsights");
        setTop10(response.data.sc)
      }
    } catch(error){
      console.log(error);
    }
  }

  // Fixed data for the charts
  const chartLabelsLeft = [
    "Needs Improvement",
    "Failed to Meet Expectations",
    "Meet Expectations",
    "Exceeds Expectations",
    "Outstanding",
  ]; //add here the data scale connection for leftside chart



  const [dataChartLeft, setDataChartLeft] = useState<number[]>([0, 0, 0, 0, 0]); 
  const fetchChartLeft = async (office, semester, ay) => {
    try{
      if(office === null && semester === null && ay === null){
        const response = await axios.get(serverUrl + "/response_data");
        setDataChartLeft(response.data);
      }else{
        const response = await axios.post(serverUrl + "/response_data", {office: office, semester: semester, ay:ay});
        setDataChartLeft(response.data);
      }
    }catch(error){
      console.error(error);
    }
  };
  const highestValueIndex = dataChartLeft.indexOf(Math.max(...dataChartLeft));
  const dynamicLabel = chartLabelsLeft[highestValueIndex] + " Result";




  const chart1Data = {
    BarChart: {
      labels: chartLabelsLeft,
      datasets: [
        {
          label: dynamicLabel,
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
          label: dynamicLabel,
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
  const fetchDataRight = async (office, semester, ay) => {
    try {
      if(office === null){
        const response = await axios.get(serverUrl + "/respondent_data");
        setChartDataRight(response.data);
      }else{
        const response = await axios.post(
          serverUrl + "respondent_data",
          { office: office, semester: semester, ay: ay },
        );
        setChartDataRight(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const chart2Data = {
    BarChart: {
      labels: chartLabelsRight,
      datasets: [
        {
          label: "RESPONSE RESULT",
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
          label: "RESPONSE RESULT",
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

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchDataRight(null, null, null),
        fetchChartLeft(null, null, null),
        fetchAcadYears(),
        fetchOffices(),
        fetchTotalFeedback(null,null,null),
        fetchTopInsights(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      
    }
  };

  const fetchWords = async(office = null, semester = null, ay = null) =>{
    try{
      if(office === null){
        const response = await axios.get(serverUrl + "/fetchWordCloud");
        setWords(response.data);
      }else{
        const response = await axios.post(serverUrl + "/fetchWordCloud", {office: office, semester: semester, ay: ay});
        setWords(response.data);
      }
    }catch(error){
      console.error(error);
    }
  };

  
  useEffect(() => {
    fetchAllData();
    fetchWords();
  }, []); 

  useEffect(() => {
    if (!selectedYear && acadYears.length > 0) {
      setSelectedYear(acadYears[0]); // Ensure the first item is selected if not already set
    }
  }, [acadYears]);



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


  const dashboardRef = useRef<HTMLDivElement>(null);

  const handlePrintReport = async () => {
    if (dashboardRef.current) {
      try {
        const canvas = await html2canvas(dashboardRef.current, {
          scale: 2, 
          useCORS: true, 
          backgroundColor: null, 
          logging: true, 
          ignoreElements: (element) => {
            return element.classList.contains('ignore-on-print');
          },
        });
  
      
        const imgData = canvas.toDataURL("image/png");
  
       
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
          <html>
            <head>
              <title>Dashboard Report</title>
              <style>
                @media print {
                  * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                }
              </style>
            </head>
            <body>
              <img src="${imgData}" />
            </body>
          </html>
          `);
          printWindow.document.close();
  
          // Wait for the image to load, then trigger print
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          };
        }
      } catch (error) {
        console.error("Error capturing the dashboard:", error);
      }
    } else {
      console.error("Dashboard reference not found.");
    }
  };
  
  return (
    <div>
     
      <main ref={dashboardRef} className="px-4">
        {!showDetailedView ? (
          <>
            <header className="w-full border-b flex items-center justify-between bg-red-900 p-2 rounded-lg">
              <div className="flex items-center">
                {/* <input
                  type="checkbox"
                  id="selectAll"
                  className="mr-2 h-5 w-5"
                  defaultChecked={true}
                  onChange={(e) => fetchAllOffice(e.target.checked ? "on" : "off")}
                />
                <label
                  htmlFor="selectAll"
                  className="text-sm text-white font-bold mr-4"
                >
                  All
                </label> */}

                <label
                  htmlFor="officeSelect"
                  className="text-sm text-white font-bold mr-2"
                >
                  Select Office
                </label>
                <select
                  id="officeSelect"
                  className="bg-white-100 text-black text-sm border border-gray-600 py-1 px-2"
                  value={event?.target.value}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue === "") {
                      fetchAllData(); 
                    } else {
                      fetchSpecificOffice(selectedValue, semester, selectedYear); 
                    }
                  }}
                >
                  <option value="">All Offices</option> 
                  {offices.map((office) => (
                    <option key={office.id} value={office.name}>
                      {office.name}
                    </option>
                  ))}
                </select>

              </div>
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
                    value={event?.target.value}
                    onChange={
                      (e) => {
                        const selectedValue = e.target.value;
                        setSemester(selectedValue);
                        if (selectedValue === "") {
                          fetchAllData(); 
                        } else {
                          fetchSpecificOffice(activeOffice, selectedValue, selectedYear); 
                        }
                      }
                    }
                  >
                    <option value="First Semester" selected>First Semester</option>
                    <option value="Second Semester">Second Semester</option>
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
                    value={event?.target.value}
                    onChange={
                      (e) => {
                        const selectedValue = e.target.value;
                        setSelectedYear(selectedValue);
                        if (selectedValue === "") {
                          fetchAllData(); 
                        } else {
                          fetchSpecificOffice(activeOffice, semester, selectedValue); 
                        }
                      }
                    } // Handle changes
                  >
                    {acadYears.map((acadYear) => (
                      <option key={acadYear} value={acadYear}>
                        {acadYear}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </header>

            <div className="relative w-full  mb-5">
              
                <h1 className="absolute top-0 left-0 m-4 text-lg font-bold">
                  Overview Of Result
                </h1>

                <div className="absolute top-0 right-0 m-4 p-1 grid grid-cols-2 items-center">
                  {/* Feedback */}
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

                {/* Center Section */}
                <div className="flex flex-col items-center justify-center">
                  <section
                    className="mt-5 flex flex-col items-center text-sm justify-center text-black text-center bg-gradient-to-b from-white to-gray-300 h-[10vh] w-[100vh] rounded-[30%] shadow-lg relative overflow-hidden font-bold cursor-pointer"
                    onClick={handleSectionClick}
                  >
                    <WordCloud words={words} options={options} />
                  </section>
                </div>
              </div>


           


            {/* Display here the top 10 bert Topic list */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-bold mb-4">Top 10 List Insight</h2>
                  <div>
                  {top10.map((top10Items, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    {top10Items.map((item, subIndex) => {
                      console.log(item);  // Logs item to the console instead of using alert
                      return (
                        <React.Fragment key={subIndex}>
                          {subIndex % 2 === 0 ? (
                            <span style={{ flex: 1, textAlign: 'left' }}>{item}</span>
                          ) : (
                            <span style={{ flex: 1, textAlign: 'right' }}>{item}</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}

                  </div>

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
                <h1 className="text-sm font-bold mr-2">Response Data Visualization for Survey</h1>
                
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
                <h1 className="text-sm font-bold mr-2">STAKEHOLDERS</h1>
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
            <div className="flex justify-end mt-4 justify-between">
              
              <button className="text-center underline" onClick={handlePrintReport} >
                Print Report
              </button>


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
          <div className="flex sm:h-1/2 border ">  
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
                <button
                onClick={() => setShowDetailedView(false)}
                className="w-full text-left text-sm sm:text-sm md:text-sm lg:text-xm border p-2 text-center mt-auto"
              >
                Close
              </button>
              </ul>

            
            </div>
            <div className="flex-1 p-2 overflow-y-auto max-h-screen">
              <div className="border p-4">{renderContent()}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Dashboard;
