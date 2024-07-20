import React, { useState } from "react";
import { CheckIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid"; // Import QuestionMarkCircleIcon

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

  const questions = [
    "Ang mga patakaran at iba't ibang kursong mapag-aaralan sa Kolehiyo ay malawak na naipapabatid sa pamamagitan ng 'bronchures', 'pamphlets' at mga lathala at anunsiyong nakapaskil sa 'bulletin boad'",
    "Ang mga panuntunan, patakaran, tuntunin at gabay patungkol sa 'admission' ay malinaw at ipinatutupad nang may sistema.",
    "Ang mga kawani ng tanggapan ay madaling lapitan, nag papaliwanag nang maayos, matulungin at may kaaya-ayang pag-uugali.",
    "Ang pagpapaskil ng mga nakapasa sa CNSC at (CNSC Admission Test) ay naaayon sa talatakdaan.",
    "Ang result ng CNSC AT ay maaaring malaman kung kinakailangan.",
  ];

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
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
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
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={handleModalToggle}
          ></div>
          <div className="fixed bottom-10 right-10 w-64 bg-white p-4 rounded-lg shadow-lg z-50">
            <button
              onClick={handleModalToggle}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <p className="bg-gray-100 rounded-lg border p-4 text-sm md:text-base lg:text-lg">
              We value your feedback! Please share your experience with School
              Student Services by rating us on a scale of 5 (Very Satisfied) to
              1 (Very Dissatisfied). Your honest feedback will help us improve
              our services to better meet your needs.
            </p>

            <div className="flex items-center mt-4">
              <label className="text-sm md:text-base lg:text-lg">5</label>
              <div className="w-4 h-4 bg-green-800 ml-2"></div>
              <span className="ml-2 text-sm md:text-base lg:text-lg">
                Very Satisfied
              </span>
            </div>

            <div className="flex items-center mt-4">
              <label className="text-sm md:text-base lg:text-lg">4</label>
              <div className="w-4 h-4 bg-green-500 ml-2"></div>
              <span className="ml-2 text-sm md:text-base lg:text-lg">
                Satisfied
              </span>
            </div>

            <div className="flex items-center mt-4">
              <label className="text-sm md:text-base lg:text-lg">3</label>
              <div className="w-4 h-4 bg-yellow-300 ml-2"></div>
              <span className="ml-2 text-sm md:text-base lg:text-lg">
                Neutral
              </span>
            </div>

            <div className="flex items-center mt-4">
              <label className="text-sm md:text-base lg:text-lg">2</label>
              <div className="w-4 h-4 bg-red-400 ml-2"></div>
              <span className="ml-2 text-sm md:text-base lg:text-lg">
                Dissatisfied
              </span>
            </div>

            <div className="flex items-center mt-4">
              <label className="text-sm md:text-base lg:text-lg">1</label>
              <div className="w-4 h-4 bg-red-700 ml-2"></div>
              <span className="ml-2 text-sm md:text-base lg:text-lg">
                Very Dissatisfied
              </span>
            </div>
          </div>
        </>
      )}

      {/* Floating button positioned at the bottom of the viewport */}
      <div
        className={`fixed p-2 bottom-0 right-2 z-${isModalOpen ? "50" : "10"}`}
      >
        <button
          onClick={handleModalToggle}
          style={{ backgroundColor: "#800000", color: "white" }}
          className="text-white p-1 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default SurveyContents;
