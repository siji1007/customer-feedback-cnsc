import React, { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const PageDots: React.FC<{ currentPage: number; totalPages: number }> = ({
  currentPage,
  totalPages,
}) => {
  return (
    <div className="relative flex items-center justify-center mb-3">
      {/* Connecting Lines */}
      <div className="absolute inset-0 flex items-center justify-between">
        {[...Array(totalPages - 1)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-1 ${index < currentPage - 1 ? "bg-black" : "bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <div
            key={index}
            className={`relative w-4 h-4 rounded-full ${index < currentPage ? "bg-black" : "bg-gray-300"}`}
          >
            {index < currentPage && (
              <CheckIcon className="absolute inset-0 w-4 h-4 text-white mx-auto my-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SurveyContents: React.FC<{ selectedOffice?: string }> = ({ selectedOffice }) => {
  const [positions, setPositions] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [poppingEmoji, setPoppingEmoji] = useState<number | null>(null); // Track which emoji is popping
  const [questions, setQuestions] = useState<string[]>([
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
  ]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const fetchQuestions = async () => {
    try {
      const response = await axios.post(serverUrl + "show_questions", {
        department: selectedOffice,
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const totalPages = Math.ceil(questions.length / 2);

  const handleEmojiClick = (questionIndex: number, value: number) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [questionIndex]: value,
    }));
    setPoppingEmoji(questionIndex); // Set the emoji to pop
    setTimeout(() => setPoppingEmoji(null), 400); // Remove pop class after animation
  };

  const getEmoji = (value: number) => {
    const emojis = ["😔", "😟", "😐", "😃", "🤩"];
    return emojis[value - 1];
  };

  const getScaleValue = (questionIndex: number) => {
    const position = positions[questionIndex] || 0;
    const values = [
      "Very Dissatisfied",
      "Dissatisfied",
      "Neutral",
      "Satisfied",
      "Very Satisfied",
    ];
    return values[position - 1];
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(serverUrl + "submit_answer", {
        student_id: globalThis.activeId,
        answer: positions,
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const Dashboard = () => {
    window.location.reload();
    setIsSuccessModalOpen(false);
  };

  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * 2;
    const endIndex = Math.min(startIndex + 2, questions.length);

    return questions.slice(startIndex, endIndex).map((question, index) => {
      const questionIndex = startIndex + index + 1;
      return (
        <form
          key={questionIndex}
          className="bg-gray-100 p-4 rounded-md shadow-md"
        >
          <p className="text-xs md:text-xs lg:text-2xl mb-4 shadow-lg">
            {question}
          </p>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                className={`cursor-pointer text-2xl ${
                  positions[questionIndex] === value ? "text-blue-500" : ""
                } ${poppingEmoji === questionIndex && positions[questionIndex] === value ? "animate-pop" : ""}`}
                onClick={() => handleEmojiClick(questionIndex, value)}
              >
                {getEmoji(value)}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            {positions[questionIndex] > 0 && (
              <span className="text-xs md:text-sm lg:text-lg font-semibold">
                {getScaleValue(questionIndex)}
              </span>
            )}
          </div>
        </form>
      );
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-screen-md relative">
      <div className="flex flex-col space-y-4">
        {renderQuestions()}
        {currentPage === totalPages && (
          <form className="bg-gray-100 p-4 rounded-md shadow-md">
            <p className="text-lg md:text-xl lg:text-2xl mb-4 shadow-lg ">
              Complaints, Comments, and Suggestion{" "}
            </p>
            <textarea
              placeholder="Your comments here..."
              className="w-full h-32 border rounded-md p-2"
            ></textarea>
          </form>
        )}
      </div>

      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="p-2 rounded-md text-gray-700 text-xs md:text-sm lg:text-base"
          >
            Previous
          </button>
          <PageDots currentPage={currentPage} totalPages={totalPages} />
          {currentPage === totalPages ? (
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: "#800000", color: "white" }}
              className="p-2 rounded-md text-white text-xs md:text-sm lg:text-base"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              style={{ backgroundColor: "#800000", color: "white" }}
              className="p-2 rounded-md text-white text-xs md:text-sm lg:text-base"
            >
              Next
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-sm">
            <p className="text-lg font-semibold">
              Are you sure you want to submit?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={handleModalToggle}
                className="bg-red-500 text-white p-2 rounded-md ml-2"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-sm">
            <p className="text-lg font-semibold">
              Successfully Submitted!
            </p>
            <button
              onClick={Dashboard}
              className="bg-blue-500 text-white p-2 rounded-md mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyContents;
