import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Department");
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  type Office = (typeof departments)[number];
  type Questionnaire = (typeof questionnaires)[number];

  const handleClick = (department) => {
    setSelectedOffice(department);
    fetchQuestionnares(department);
  };

  const fetchQuestionnares = async (dept) => {
    try {
      const response = await axios.post(serverUrl + "/flash-questionnaire", {
        sDepartment: dept,
      });
      setQuestionnaires(response.data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(serverUrl + "all_department");
        setDepartments(response.data.departments);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    fetchDepartments();
    fetchQuestionnares("ICS");
  }, []);

  const [selectedOffice, setSelectedOffice] = useState<Office>("ICS");
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire>();

  const renderContent = () => {
    switch (activeTab) {
      case "Department":
        return <div className="mt-4">Department Content</div>;
      case "Questions":
        return (
          <div className="flex flex-col md:flex-row h-full overflow-x-hidden">
            {/* Sidebar */}
            <div
              className="md:w-1/4 w-full p-4 border-b md:border-b-0 md:border-r"
              style={{ height: "260px", background: "gray" }}
            >
              <h2 className="font-bold mb-4">Offices</h2>
              <ul
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: "calc(100% - 1rem)" }}
              >
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 ${selectedOffice === department ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onClick={() => handleClick(department)}
                  >
                    {department}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Section */}
            <div className="md:w-3/4 w-full p-4 overflow-y-auto text-center">
              <h2 className="font-bold mb-4">
                Questionnaires for {selectedOffice}
              </h2>
              <ul className="space-y-2">
                {questionnaires.map((questionnaire, index) => (
                  <li
                    key={index}
                    className={`mb-2 text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer p-2 ${selectedQuestionnaire === questionnaire ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onClick={() => setSelectedQuestionnaire(questionnaire)}
                  >
                    {questionnaire}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "Notification":
        return <div className="mt-4">Notification Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center mb-4 rounded-lg p-2 bg-red-800">
        <button
          className={`px-4 py-2 rounded-lg text-white ${activeTab === "Department" ? "bg-white text-black font-bold" : "hover:bg-white hover:text-red-800"}`}
          onClick={() => setActiveTab("Department")}
        >
          Department
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ml-2 ${activeTab === "Questions" ? "bg-white text-red-900 font-bold" : "hover:bg-white hover:text-red-800"}`}
          onClick={() => setActiveTab("Questions")}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-white ml-2 ${activeTab === "Notification" ? "bg-white text-red-900 font-bold" : "hover:bg-white hover:text-red-800"}`}
          onClick={() => setActiveTab("Notification")}
        >
          Notification
        </button>
      </div>

      {/* Render content based on active tab */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default Settings;
