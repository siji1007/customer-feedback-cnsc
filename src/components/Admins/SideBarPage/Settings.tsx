import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

const Settings: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Department");
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  type Office = (typeof departments)[number];

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

  const editQuestinnaires = async (qid, question) => {
    try {
      const response = await axios.post(serverUrl + "/edit-questionnaire", {
        qid: qid,
        question: question,
      });
    } catch (error) {
      console.error("Error editing question: ", error);
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
    fetchQuestionnares(null);
  }, []);

  const [selectedOffice, setSelectedOffice] = useState<Office>(null);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>("");

  const handleEditClick = (index: number, question: string) => {
    setEditIndex(index);
    setEditQuestion(question);
  };

  const handleSaveClick = () => {
    console.log(editQuestion, editIndex);
    console.log(questionnaires["qid"][editIndex]);
  };

  const handleCancelClick = () => {
    setEditIndex(null); // Exit edit mode without saving
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Department":
        return <div className="mt-4">Department Content</div>;
      case "Questions":
        return (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Sidebar */}
            <div
              className="md:w-1/4 w-full border-b md:border-b-0 md:border-r rounded-lg"
              style={{ height: "35vh", background: "#c3c3c3" }}
            >
              <h2
                className="font-bold mb-4 text-center b-border text-black border-b-2 border-white"
                style={{ color: "maroon" }}
              >
                Select Office to Edit Questions
              </h2>
              <ul
                className="space-y-2 overflow-y-auto text-black rounded-lg p-2"
                style={{
                  maxHeight: "calc(100% - 1rem)",
                  background: "#c3c3c3",
                }}
              >
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 border border-white rounded-lg ${selectedOffice === department ? "bg-red-800 text-white" : "hover:bg-gray-100"}`}
                    onClick={() => handleClick(department)}
                  >
                    {department}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Section */}
            <div
              className="md:w-3/4 w-full p-4 overflow-y-auto shadow-lg"
              style={{ height: "35vh" }}
            >
              <h2 className="font-bold mb-4 text-xl">{selectedOffice}</h2>
              <ul className="space-y-2 overflow-y-auto ">
                {questionnaires["questionData"].map((questionnaire, index) => (
                  <li
                    key={index}
                    className="bg-gray-300 text-black p-4 rounded-md shadow-md mb-2 relative "
                    style={{ backgroundColor: "#c3c3c3" }} // Gray background color
                  >
                    {editIndex === index ? (
                      <div>
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full mb-2 p-2 rounded-md border border-gray-400"
                        />
                        <button
                          onClick={handleSaveClick}
                          className=" text-white px-4 py-2 rounded-md mr-2"
                          style={{ background: "#006400" }}
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="bg-red-800 text-white px-4 py-2 rounded-md"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        {questionnaire}
                        <button
                          onClick={() => handleEditClick(index, questionnaire)}
                          className="absolute top-2 right-2  hover:text-blue-800"
                          style={{ color: "maroon" }}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    )}
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
          className={`px-4 py-2 rounded-lg ${activeTab === "Department" ? "bg-white text-black font-bold" : "bg-transparent text-white hover:bg-white hover:text-red-800"}`}
          onClick={() => setActiveTab("Department")}
        >
          Department
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "Questions" ? "bg-white text-black font-bold" : "bg-transparent text-white hover:bg-white hover:text-red-800"}`}
          onClick={() => setActiveTab("Questions")}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "Notification" ? "bg-white text-black font-bold" : "bg-transparent text-white hover:bg-white hover:text-red-800"}`}
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
