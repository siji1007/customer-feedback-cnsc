import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Modal from "react-modal";

interface DepartmentData {
  department: string;
}

interface OfficeData {
  office: string;
}

interface Office {
  id: number;
  name: string;
}

interface Question {
  qid: string;
  question: string;
}

const Settings: React.FC = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Department");
  const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const [questionnaireIds, setQuestionnaireIds] = useState<string[]>([]);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([] || null);
  const [deptData, setDeptData] = useState<DepartmentData>({
    department: "",
  });
  const [officeData, setOfficeData] = useState<OfficeData>({
    office: "",
  });
  const [feedbackChecked, setFeedBackChecked] = useState(false);
  const [remindersChecked, setRemindersChecked] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<
    number | null
  >(null);
  const [newQuestionnaireName, setNewQuestionnaireName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const questionAreaRef = useRef<HTMLTextAreaElement>(null);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const [qStatus, setQStatus] = useState([]);
  const [acadYears, setAcadYears] = useState([]);

  const handleOpenModal = async (index: number) => {
    //console.log("Opening modal for questionnaire index:", index); // Debugging line
    /*try {
      const response = await axios.post(serverUrl + "show_questions");
    } catch (error) {
      console.log("Error fetching questions: ", error);
    }*/

    setSelectedQuestionnaire(index);
    getQuestions(index);
    setModalIsOpen(true);
  };

  const handleEditQuestion = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const updatedQuestion = {
      ...editQuestion,
      [event.target.name]: event.target.value,
    };
    setEditQuestion(updatedQuestion);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setEditIndex(null);
  };

  const handleClick = (office: Office) => {
    setSelectedOffice(office);
    setSelectedQuestionnaire(null);
    getQuestionnaires(office.name);
    fetchQuestionnaireStatus(office.name);
  };

  const handleAddDept = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeptData({ ...deptData, [event.target.name]: event.target.value });
  };

  const handleAddOffice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOfficeData({ ...officeData, [event.target.name]: event.target.value });
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

  const handleAddOfficeClick = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();
      const response = await axios.post(serverUrl + "add-office", officeData);
      fetchOffices();
      setOfficeData({ ...officeData, office: "" });
    } catch (error) {
      console.log("Error adding office: ", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get<{ departments: string[] }>(
        serverUrl + "department",
      );
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  const fetchOffices = async () => {
    try {
      // Temporary fallback list

      const response = await axios.get<{ offices: Office[] }>(
        serverUrl + "office",
      );
      setOffices(response.data.offices);
    } catch (error) {
      console.error("Error fetching offices: ", error);
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

  const getQuestionnaires = async (office) => {
    try {
      const response = await axios.post(serverUrl + "flash-questionnaire", {
        office: office,
      });
      setQuestionnaireIds(response.data.qid);
      setQuestionnaires(response.data.name);
    } catch (error) {
      console.log("Error fetching questionnaires: ", error);
    }
  };

  const getQuestions = async (index) => {
    try {
      const response = await axios.post(serverUrl + "get_questions", {
        qid: questionnaireIds[index],
      });
      setQuestions(response.data);
      setActiveQuestionnaire(questionnaireIds[index]);
    } catch (error) {
      console.log("Error fetching questions: ", error);
    }
  };

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question>({
    qid: "",
    question: "",
  });

  const handleEditClick = (index: number, question: string) => {
    setEditIndex(index);
    setEditQuestion({ ...editQuestion, question: question });
  };

  const handleSaveClick = async (questionnaireId, index, question) => {
    try {
      const response = await axios.post(serverUrl + "edit-question", {
        qid: questionnaireId,
        q_id: questions[index]["q_id"],
        question: question,
      });
      getQuestions(index);
    } catch (error) {
      console.log(error);
    }

    setEditIndex(null);
  };

  const handleCancelClick = () => {
    setEditIndex(null);
  };

  const handleAddQuestionnaire = async () => {
    if (selectedOffice) {
      const newQuestionnaire = {
        name: newQuestionnaireName,
        questions: [],
        office: selectedOffice["name"],
        status: "active",
      };
      setNewQuestionnaireName(""); // Clear the input field
      try {
        const response = await axios.post(
          serverUrl + "add-questionnaire",
          newQuestionnaire,
        );
        getQuestionnaires(selectedOffice.name);
      } catch (error) {
        console.log("Error adding questionnaire: ", error);
      }
    }
  };

  const handleArchiving = async (index: number) => {
    try {
      const response = await axios.post(serverUrl + "/updateQStatus", {
        qid: questionnaireIds[index],
        status: "archive",
      });
      getQuestionnaires(selectedOffice?.name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOffice = (index: number) => {
    //add here the function to delete.
  };

  const handleAddQuestion = async (question: string) => {
    try {
      const response = await axios.post(serverUrl + "add-question", {
        qid: questionnaireIds[selectedQuestionnaire],
        question: question,
      });
      getQuestions(selectedQuestionnaire);
      setQuestionText("");
      if (questionAreaRef.current) {
        questionAreaRef.current.selectionStart = 0;
        questionAreaRef.current.selectionEnd = 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestionnaireStatus = async (office) => {
    try {
      const response = await axios.post(
        serverUrl + "fetchQuestionnaireStatus",
        {
          office: office,
        },
      );
      setQStatus(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQStatus = async (qid, newStatus) => {
    try {
      const response = await axios.post(serverUrl + "updateQStatus", {
        qid: qid,
        status: newStatus,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleQVisibility = (index) => {
    setQStatus((prevState) => {
      const newStatus = [...prevState];
      newStatus[index] = newStatus[index] === "active" ? "hidden" : "active";
      updateQStatus(questionnaireIds[index], newStatus[index]);
      return newStatus;
    });
  };

  const getAcadYear = async() =>{
    try{
      const response = await axios.get(serverUrl + "get_acad_years")
      setAcadYears(response.data)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
    fetchFeedbackState();
    fetchReminderState();
    getAcadYear();
  }, []);

  useEffect(() => {
    if (offices.length > 0) {
      const firstOffice = offices[0];
      setSelectedOffice(firstOffice);
      getQuestionnaires(firstOffice.name); // Assuming `name` is the identifier for the office in your API
    }
  }, [offices]);

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
                    placeholder="Add description here."
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
                    className="mb-5 bg-gray-300 flex items-center justify-between p-2 rounded-lg border border-black"
                  >
                    {department}

                    <button className="text-red-800">
                      <FaTimes />
                    </button>
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
                Add Offices
              </h2>
              <form
                className="flex flex-col space-y-4"
                onSubmit={handleAddOfficeClick}
              >
                <div>
                  <label className="block text-gray-700 mb-2">Office</label>
                  <input
                    type="text"
                    name="office"
                    value={officeData.office}
                    onChange={handleAddOffice}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Add description here."
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
                {offices.map((office) => (
                  <li
                    key={office.id}
                    className="mb-5 bg-gray-300 p-2 flex items-center justify-between rounded-lg border border-black"
                  >
                    <span>{office.name}</span>
                    <button
                      className="text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOffice(index);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </li>
                ))}
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
              style={{ height: "50vh", background: "#c3c3c3" }}
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
              style={{
                height: "50vh",
                background: "#c3c3c3",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2
                className="font-bold mb-4 text-center b-border text-black border-b-2 border-white"
                style={{ color: "maroon" }}
              >
                Questionnaires for {selectedOffice?.name || "Select an Office"}
              </h2>
              <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2 text-black rounded-lg p-2">
                  {questionnaires.length != 0 && (
                    <ul className="space-y-2 text-black rounded-lg p-2">
                      {questionnaires.map((questionnaire, index) => (
                        <li
                          key={index}
                          className={`flex items-center justify-between p-2 border border-white rounded-lg ${selectedQuestionnaire === index ? "bg-white text-red-800 font-bold" : "hover:bg-gray-100"}`}
                          onClick={() => handleOpenModal(index)}
                        >
                          <span>{questionnaire}</span>
                          <div className="flex items-center">
                            <button
                              className="text-red-800 mr-2"
                              onClick={() => {
                                toggleQVisibility(index);
                              }}
                            >
                              {qStatus[index] === "active" ? (
                                <FaEye />
                              ) : (
                                <FaEyeSlash />
                              )}
                            </button>
                            <button
                              className="text-red-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchiving(index);
                              }}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {questionnaires.length == 0 && (
                    <li className="p-2 text-gray-600">
                      No questionnaires found.
                    </li>
                  )}
                </ul>
              </div>
              <div className="mt-4">
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={newQuestionnaireName}
                    onChange={(e) => setNewQuestionnaireName(e.target.value)}
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
              </div>
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
                  Add/Edit Questions
                </h2>
                {questions.length !== 0 && (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {questions.map((question, index) => (
                      <li
                        key={index}
                        className="p-2 bg-white border border-black rounded-lg flex flex-col"
                      >
                        {editIndex === index ? (
                          <>
                            <textarea
                              name="question"
                              value={editQuestion.question}
                              onChange={handleEditQuestion}
                              className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-800 resize-none"
                              rows={3} // Adjust rows as needed
                            />
                            <div className="flex space-x-2 mt-2">
                              <FaSave
                                className="cursor-pointer w-6 h-6"
                                onClick={() =>
                                  handleSaveClick(
                                    activeQuestionnaire,
                                    index,
                                    editQuestion.question,
                                  )
                                }
                              />
                              <FaTimes
                                className="cursor-pointer w-6 h-6"
                                onClick={handleCancelClick}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="break-words">
                              {question.question}
                            </span>
                            <FaEdit
                              className="cursor-pointer mt-2 w-6 h-6"
                              onClick={() =>
                                handleEditClick(index, question.question)
                              }
                            />
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <textarea
                  ref={questionAreaRef}
                  value={questionText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setQuestionText(e.target.value)
                  }
                  placeholder={
                    questions.length >= 5
                      ? "Maximum limit reached. You can't add more questions."
                      : "Type a new question and press Enter to add it."
                  }
                  className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:border-red-800 resize-none mt-2"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      e.currentTarget.value.trim() &&
                      questions.length < 5
                    ) {
                      handleAddQuestion(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  rows={3}
                  disabled={questions.length >= 5}
                />
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
      case "Validity":
        return (
          <div className="mt-4 space-y-4">
            <section className="relative bg-gray-300 p-4 rounded-lg border border-black">
              <h1 className="text-xl font-semibold">Academic Year</h1>
              <p>
                Use this to set the academic year range of the survey.
              </p>
              <div className="top-0 right-0 mt-2 mr-2 font-bold">
                <select>
                  {acadYears.map((acads) =>(
                    <option key={acads} value={acads}>
                      {acads}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="relative bg-gray-300 p-4 rounded-lg border border-black">
              <h1 className="text-xl font-semibold">Semester</h1>
              <p>
                Use this to set the current semester of the survey.
              </p>
              <div className="top-0 right-0 mt-2 mr-2 font-bold">
                <select>
                  <option>First Semester</option>
                  <option>Second Semester</option>
                  <option>Mid Year</option>
                </select>
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
      <div className="flex items-center mb-4 rounded-lg p-2 bg-red-800 ">
        <button
          className={`px-4 py-2 rounded-lg sm:w-40 md:w-32 lg:w-28 mr-1 ${
            activeTab === "Department"
              ? "border-b-4 border-white text-white font-bold text-center"
              : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
          }`}
          onClick={() => setActiveTab("Department")}
        >
          Department
        </button>
        <button
          className={`px-4 py-2 rounded-lg  sm:w-40 md:w-32 lg:w-28 mr-1 ${
            activeTab === "Office"
              ? "border-b-4 border-white text-white font-bold text-center"
              : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
          }`}
          onClick={() => setActiveTab("Office")}
        >
          Offices
        </button>
        <button
          className={`px-4 py-2 rounded-lg sm:w-40 md:w-32 lg:w-28 mr-1 ${
            activeTab === "Questions"
              ? "border-b-4 border-white text-white font-bold text-center"
              : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
          }`}
          onClick={() => setActiveTab("Questions")}
        >
          Questions
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-center sm:w-40 md:w-32 lg:w-28 ${
            activeTab === "Notification"
              ? "border-b-4 border-white text-white font-bold text-center"
              : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
          }`}
          onClick={() => setActiveTab("Notification")}
        >
          Notification
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-center sm:w-40 md:w-32 lg:w-28 ${
            activeTab === "Validity"
              ? "border-b-4 border-white text-white font-bold text-center"
              : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
          }`}
          onClick={() => setActiveTab("Validity")}
        >
          Validity
        </button>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default Settings;
