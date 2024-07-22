import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";

interface DepartmentData {
  department: string;
  dept_type: string;
}

const Settings: React.FC = () => {
  const [offices, setOffices] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Department");
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const [deptData, setDeptData] = useState<DepartmentData>({
    department: "",
    dept_type: "academic",
  });
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  type Office = (typeof offices)[number];

  const handleClick = (department) => {
    setSelectedOffice(department);
    fetchQuestionnares(department);
  };

  const handleAddDept = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeptData({ ...deptData, [event.target.name]: event.target.value });
  };

  const handleAddClick = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const response = await axios.post(serverUrl + "add-dept", deptData);
      fetchDepartments();
      setDeptData({ ...deptData, department: "" });
    } catch (error) {
      console.log("Error adding department: ", error);
    }
  };

  const fetchQuestionnares = async (dept) => {
    try {
      const response = await axios.post(serverUrl + "flash-questionnaire", {
        sDepartment: dept,
      });
      setQuestionnaires(response.data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const editQuestinnaires = async (qid, question) => {
    try {
      const response = await axios.post(serverUrl + "edit-questionnaire", {
        qid: qid,
        question: question,
      });
    } catch (error) {
      console.error("Error editing question: ", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(serverUrl + "academic_department");
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axios.get(serverUrl + "service_department");
        setOffices(response.data.departments);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    fetchOffices();

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
    editQuestinnaires(questionnaires["qid"][editIndex], editQuestion);
    setEditIndex(null);
  };

  const handleCancelClick = () => {
    setEditIndex(null); // Exit edit mode without saving
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Department":
        return (
          <div className="mt-4 flex">
            <section className="w-1/2 p-4 bg-gray-300 rounded-lg mr-4 border border-black">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Add Department
              </h2>
              <form
                className="flex flex-col space-y-4 "
                onSubmit={handleAddClick}
              >
                <div>
                  <label className="block text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={deptData.department}
                    onChange={handleAddDept}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="No label input"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </form>
            </section>

            <section className="w-1/2 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Added Departments</h2>
              {/* Placeholder for dynamically added departments */}
              <ul className="pl-5 max-h-40 overflow-y-auto">
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className="mb-5 bg-gray-300 p-2 rounded-lg border border-black"
                  >
                    {department}
                  </li>
                ))}
                {/* Add more departments as needed */}
              </ul>
            </section>
          </div>
        );
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
                {offices.map((office, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 border border-white rounded-lg ${selectedOffice === office ? "bg-red-800 text-white" : "hover:bg-gray-100"}`}
                    onClick={() => handleClick(office)}
                  >
                    {office}
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
        return (
          <div className="mt-4 space-y-4">
            <section className="relative bg-gray-300 p-4 rounded-lg border border-black">
              <h1 className="text-xl font-semibold">Feedback</h1>
              <p>
                These are notifications for feedback on <br />{" "}
                Student/staff/faculty, service satisfaction.
              </p>
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
                </label>
              </div>
            </section>

            <section className="relative bg-gray-300 p-4 rounded-lg border border-black">
              <h1 className="text-xl font-semibold">Reminders</h1>
              <p>
                These are notifications to remind for updates <br /> might be
                missed
              </p>
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"></div>
                </label>
              </div>
            </section>
          </div>
        );
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
