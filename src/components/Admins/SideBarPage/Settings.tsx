import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";

interface DepartmentData {
  department: string;
  dept_type: string;
}

interface Questionnaire {
  name: string;
  questions: string[];
}

interface Office {
  id: number;
  name: string;
}

const Settings: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Department");
  const [questionnaires, setQuestionnaires] = useState<{
    [key: string]: Questionnaire[];
  }>({});
  const [deptData, setDeptData] = useState<DepartmentData>({
    department: "",
    dept_type: "academic",
  });
  const [feedbackChecked, setFeedBackChecked] = useState(false);
  const [remindersChecked, setRemindersChecked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<
    number | null
  >(null);

  const [newQuestionnaireName, setNewQuestionnaireName] = useState("");

  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const handleOpenModal = (index: number) => {
    console.log("Opening modal for questionnaire index:", index); // Debugging line
    setSelectedQuestionnaire(index);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setEditIndex(null);
  };

  const handleClick = (office: Office) => {
    setSelectedOffice(office);
    setSelectedQuestionnaire(null);
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get<{ departments: string[] }>(
        serverUrl + "academic_department",
      );
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  const fetchFeedbackState = async () => {
    try {
      const response = await axios.get(serverUrl + "get-config");
      setFeedBackChecked(response.data.feedback_state[0]);
    } catch (error) {
      console.error("Error fetching state: ", error);
    }
  };

  const fetchReminderState = async () => {
    try {
      const response = await axios.get(serverUrl + "get-config");
      setRemindersChecked(response.data.reminder_state[0]);
    } catch (error) {
      console.log("Error fetching state: ", error);
    }
  };

  const toggleFeedback = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedBackChecked(event.target.checked);
    try {
      await axios.post(serverUrl + "set-feedback-conf", {
        "feedback-conf": event.target.checked,
      });
    } catch (error) {
      console.log("Error updating feedback configuration: ", error);
    }
  };

  const toggleReminder = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemindersChecked(event.target.checked);
    try {
      await axios.post(serverUrl + "set-reminder-conf", {
        "reminder-conf": event.target.checked,
      });
    } catch (error) {
      console.log("Error updating reminder configuration: ", error);
    }
  };

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        // Temporary fallback list
        setOffices([
          { id: 1, name: "HR" },
          { id: 2, name: "Engineering" },
          { id: 3, name: "Marketing" },
        ]);
        const response = await axios.get<{ departments: Office[] }>(
          serverUrl + "service_department",
        );
        setOffices(response.data.departments);
      } catch (error) {
        console.error("Error fetching offices: ", error);
      }
    };

    fetchOffices();
    fetchDepartments();
    fetchFeedbackState();
    fetchReminderState();
  }, []);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<string>("");

  const handleEditClick = (index: number, question: string) => {
    setEditIndex(index);
    setEditQuestion(question);
  };

  const handleSaveClick = () => {
    if (selectedQuestionnaire === null || selectedOffice === null) return;

    const updatedQuestionnaires = [
      ...(questionnaires[selectedOffice.name] || []),
    ];
    updatedQuestionnaires[selectedQuestionnaire].questions[editIndex!] =
      editQuestion;
    setQuestionnaires({
      ...questionnaires,
      [selectedOffice.name]: updatedQuestionnaires,
    });
    setEditIndex(null);
  };

  const handleCancelClick = () => {
    setEditIndex(null);
  };

  const handleAddQuestionnaire = () => {
    if (selectedOffice) {
      const newQuestionnaire = { name: newQuestionnaireName, questions: [] };
      const updatedQuestionnaires = [
        ...(questionnaires[selectedOffice.name] || []),
      ];
      updatedQuestionnaires.push(newQuestionnaire);
      setQuestionnaires({
        ...questionnaires,
        [selectedOffice.name]: updatedQuestionnaires,
      });
      setNewQuestionnaireName(""); // Clear the input field
    }
  };

  const handleDeleteQuestionnaire = (index: number) => {
    if (selectedOffice) {
      const updatedQuestionnaires = [
        ...(questionnaires[selectedOffice.name] || []),
      ];
      updatedQuestionnaires.splice(index, 1);
      setQuestionnaires({
        ...questionnaires,
        [selectedOffice.name]: updatedQuestionnaires,
      });
      setSelectedQuestionnaire(null);
    }
  };

  const handleAddQuestion = (question: string) => {
    if (selectedQuestionnaire === null || selectedOffice === null) return;

    const updatedQuestionnaires = [
      ...(questionnaires[selectedOffice.name] || []),
    ];
    updatedQuestionnaires[selectedQuestionnaire].questions.push(question);
    setQuestionnaires({
      ...questionnaires,
      [selectedOffice.name]: updatedQuestionnaires,
    });
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
                className="flex flex-col space-y-4"
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
              <ul className="pl-5 max-h-40 overflow-y-auto">
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className="mb-5 bg-gray-300 p-2 rounded-lg border border-black"
                  >
                    {department}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        );
      case "Office":
        return (
          <div className="mt-4 flex">
            <section className="w-1/2 p-4 bg-gray-300 rounded-lg mr-4 border border-black">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Add Office
              </h2>
              <form
                className="flex flex-col space-y-4"
                onSubmit={handleAddClick}
              >
                <div>
                  <label className="block text-gray-700 mb-2">Office</label>
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
              <h2 className="text-xl font-semibold mb-4">Added Offices</h2>
              <ul className="pl-5 max-h-40 overflow-y-auto">
                /*
                {departments.map((department, index) => (
                  <li
                    key={index}
                    className="mb-5 bg-gray-300 p-2 rounded-lg border border-black"
                  >
                    {department}
                  </li>
                ))}
                */
              </ul>
            </section>
          </div>
        );
      case "Questions":
        return (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Office Selection */}
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
                {offices.map((office) => (
                  <li
                    key={office.id}
                    className={`cursor-pointer p-2 border border-white rounded-lg ${selectedOffice && selectedOffice.id === office.id ? "bg-red-800 text-white" : "hover:bg-gray-100"}`}
                    onClick={() => handleClick(office)}
                  >
                    {office.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questionnaire List */}
            <div
              className="w-full border-b md:border-b-0 md:border-r rounded-lg p-4 ml-2"
              style={{ height: "35vh", background: "#c3c3c3" }}
            >
              <h2
                className="font-bold mb-4 text-center b-border text-black border-b-2 border-white"
                style={{ color: "maroon" }}
              >
                Questionnaires for {selectedOffice?.name || "Select an Office"}
              </h2>
              <ul className="space-y-2 text-black rounded-lg p-2">
                {selectedOffice && (
                  <>
                    {questionnaires[selectedOffice.name] &&
                    questionnaires[selectedOffice.name].length > 0 ? (
                      <>
                        {questionnaires[selectedOffice.name].map(
                          (questionnaire, index) => (
                            <li
                              key={index}
                              className={`flex items-center justify-between p-2 border border-white rounded-lg ${selectedQuestionnaire === index ? "bg-red-800 text-white" : "hover:bg-gray-100"}`}
                              onClick={() => handleOpenModal(index)}
                            >
                              <span>{questionnaire.name}</span>
                              <button
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteQuestionnaire(index);
                                }}
                              >
                                <FaTimes />
                              </button>
                            </li>
                          ),
                        )}
                      </>
                    ) : (
                      <li className="p-2 text-gray-600">
                        No questionnaires found.
                      </li>
                    )}
                    <li className="p-2">
                      <div className="flex flex-col items-center">
                        <input
                          type="text"
                          value={newQuestionnaireName}
                          onChange={(e) =>
                            setNewQuestionnaireName(e.target.value)
                          }
                          placeholder="New Questionnaire Name"
                          className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-800"
                        />
                        <button
                          className="mt-2 bg-red-800 text-white py-1 px-4 rounded-lg"
                          onClick={handleAddQuestionnaire}
                        >
                          Add Questionnaire
                        </button>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Modal for Editing Questions */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={handleCloseModal}
              contentLabel="Edit Questions"
              className="fixed inset-0 flex items-center justify-center z-50"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md sm:max-w-lg mx-auto w-full">
                <h2
                  className="font-bold mb-4 text-center text-black border-b-2 border-white"
                  style={{ color: "maroon" }}
                >
                  Edit Questions
                </h2>
                {selectedQuestionnaire !== null && selectedOffice && (
                  <ul className="space-y-2">
                    {questionnaires[selectedOffice.name][
                      selectedQuestionnaire
                    ].questions.map((question, index) => (
                      <li
                        key={index}
                        className="p-2 bg-white border border-black rounded-lg flex flex-col "
                      >
                        {editIndex === index ? (
                          <>
                            <textarea
                              value={editQuestion}
                              onChange={(e) => setEditQuestion(e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-800 resize-none"
                              rows={3} // Adjust rows as needed
                            />
                            <div className="flex space-x-2 mt-2">
                              <FaSave
                                className="cursor-pointer w-6 h-6"
                                onClick={handleSaveClick}
                              />
                              <FaTimes
                                className="cursor-pointer w-6 h-6"
                                onClick={handleCancelClick}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="break-words">{question}</span>
                            <FaEdit
                              className="cursor-pointer mt-2 w-6 h-6"
                              onClick={() => handleEditClick(index, question)}
                            />
                          </>
                        )}
                      </li>
                    ))}
                    <li className="p-2">
                      <textarea
                        placeholder="Add a new question"
                        className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-800 resize-none"
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value.trim()
                          ) {
                            handleAddQuestion(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        rows={3} // Adjust rows as needed
                      />
                    </li>
                  </ul>
                )}
                <button
                  className="mt-4 w-full bg-red-800 text-white py-1 rounded-lg"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </Modal>
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={feedbackChecked}
                    onChange={toggleFeedback}
                  />
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={remindersChecked}
                    onChange={toggleReminder}
                  />
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
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Department"
              ? "bg-white text-black font-bold"
              : "bg-transparent text-white hover:bg-white hover:text-red-800"
          }`}
          onClick={() => setActiveTab("Department")}
        >
          Department
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Office"
              ? "bg-white text-black font-bold"
              : "bg-transparent text-white hover:bg-white hover:text-red-800"
          }`}
          onClick={() => setActiveTab("Office")}
        >
          Office
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Questions"
              ? "bg-white text-black font-bold"
              : "bg-transparent text-white hover:bg-white hover:text-red-800"
          }`}
          onClick={() => setActiveTab("Questions")}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Notification"
              ? "bg-white text-black font-bold"
              : "bg-transparent text-white hover:bg-white hover:text-red-800"
          }`}
          onClick={() => setActiveTab("Notification")}
        >
          Notification
        </button>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default Settings;
