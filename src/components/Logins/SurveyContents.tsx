import React, { useState, useEffect } from "react";
import { CheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
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

const SurveyContents: React.FC = () => {
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
  const [questions, setQuestions] = useState<string[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  const fetchQuestions = async () => {
    try {
      const response = await axios.post(serverUrl + "show_questions");
      setQuestions(response.data); // Assuming response.data contains the questions
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const totalPages = Math.ceil(questions.length / 2);

  const handleDrag = (
    e: React.MouseEvent<HTMLDivElement>,
    questionIndex: number,
  ) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    let newPosition = ((e.clientX - rect.left) / rect.width) * 100;

    if (newPosition < 0) newPosition = 0;
    if (newPosition > 100) newPosition = 100;

    setPositions((prevPositions) => ({
      ...prevPositions,
      [questionIndex]: newPosition,
    }));
  };

  const getPointerColor = (questionIndex: number) => {
    const scaleWidth = 100 / 5; // 5 segments
    const position = positions[questionIndex] || 0;
    const index = Math.floor(position / scaleWidth);
    const colors = ["from-green-400", "via-yellow-400", "to-red-400"];
    return colors[index % colors.length];
  };

  const getScaleValue = (questionIndex: number) => {
    const scaleWidth = 100 / 5; // 5 segments
    const position = positions[questionIndex] || 0;
    const index = Math.floor(position / scaleWidth);
    const values = [
      "Very Satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very Dissatisfied",
    ];
    return values[index];
  };

  const handleNext = () => {
    if (currentPage === 1) {
      // Log the selected values for the current page's questions
      for (let i = 1; i <= 2; i++) {
        const selectedValue = getScaleValue(i);
        console.log(`Question ${i}: ${selectedValue}`);
      }
    }
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form Submitted with values:", positions);
    setIsSuccessModalOpen(true);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const Dashboard = () => {
    window.location.reload(); // Consider if this is the correct behavior
    setIsSuccessModalOpen(false); // Close success modal
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

          <div
            className="relative w-full h-16 md:h-20"
            onMouseMove={(e) => handleDrag(e, questionIndex)}
            onMouseDown={(e) => e.preventDefault()} // To prevent text selection while dragging
          >
            <div className="absolute inset-0 h-10 md:h-12 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded flex items-center overflow-hidden">
              <div
                className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-black ${getPointerColor(questionIndex)}`}
                style={{
                  left: `${positions[questionIndex] || 0}%`,
                  transition: "background-color 0.2s",
                }}
              ></div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
              <span className="text-xs md:text-sm lg:text-lg font-semibold whitespace-nowrap">
                {getScaleValue(questionIndex)}
              </span>
            </div>
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
            <p className="text-lg font-semibold">Are you sure you want to close?</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleModalToggle} className="text-gray-700">
                Cancel
              </button>
              <button
                onClick={Dashboard}
                className="ml-4 bg-blue-500 text-white p-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-sm">
            <p className="text-lg font-semibold">Submission Successful!</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={Dashboard}
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyContents;
