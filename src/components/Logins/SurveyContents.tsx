import React, { useState, useEffect, useRef } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import SurveyDashboard from "./ClientDashboard";
import PageDots from "./PageDots";

interface Question {
  q_id: string;
  question: string;
}

const SurveyContents: React.FC<{ selectedOffice?: string[] }> = ({
  selectedOffice = [],
}) => {
  const [positions, setPositions] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [poppingEmoji, setPoppingEmoji] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [view, setView] = useState<"survey" | "dashboard">("survey");
  const [initialTotalDots, setInitialTotalDots] = useState<number>(0);
  const [completedDots, setCompletedDots] = useState<number>(0);
  const [currentOfficeIndex, setCurrentOfficeIndex] = useState<number>(0); // State for current office index
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const questionRefs = useRef<Array<HTMLFormElement | null>>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [comment, setComment] = useState("");
  const [isExternal, setIsExternal] = useState(false); // State for external questions
  const [acadYear, setAcadYear] = useState("");
  const [semester, setSemester] = useState("");

  const fetchValidity = async () => {
    try{
      const response = await axios.get(serverUrl + "get_validity")
      setAcadYear(response.data.acadYear[0]);
      setSemester(response.data.semester[0]);
    }catch(error){
      console.error("Error fetching validity", error);
    }
  }

  // Function to fetch external client questions depends on what offices user selected
  const fetchExternalQuestions = async () => {
    try {
      alert("This is External questions")
      const response = await axios.get(serverUrl + "show_external_questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching external questions:", error);
    }
  };

  // Function to fetch internal client questions
  const fetchInternalQuestions = async () => {
    try {
      alert("This is Internal questions")
      const response = await axios.post(serverUrl + "show_questions", {
        office: selectedOffice[currentOfficeIndex], // Use currentOfficeIndex
      });
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Determine which questions to load based on localStorage value
  useEffect(() => {
    const showForm = localStorage.getItem("ShowSurvey");

    if (showForm === "external") {
      setIsExternal(true); // Set flag for external questions
      fetchExternalQuestions(); // Fetch external client questions
    } else {
      setInitialTotalDots(selectedOffice.length);
      fetchInternalQuestions(); // Fetch internal client questions
    }

    fetchValidity();
  }, [selectedOffice, currentOfficeIndex]);

  const handleEmojiClick = (questionIndex: number, value: number) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [questionIndex]: value,
    }));
    setPoppingEmoji(questionIndex);

    const nextQuestionIndex = questionIndex + 1;
    if (nextQuestionIndex <= questions.length) {
      questionRefs.current[nextQuestionIndex - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const getEmojiClass = (questionIndex: number, value: number) => {
    const isSelected = positions[questionIndex] === value;
    return `cursor-pointer text-2xl ${isSelected ? "scale-150 text-blue-500" : ""} ${
      poppingEmoji === questionIndex && !isSelected ? "text-yellow-500 animate-pop" : "text-customGray"
    }`;
  };

  const getEmoji = (value: number, isSelected: boolean) => {
    const emojiSources = [
      {
        srcSet: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f614/512.webp", src: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f614/512.gif", alt: "😔",},
      { srcSet: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f641/512.webp", src: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f641/512.gif", alt: "🙁",},
      { srcSet: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp", src: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif", alt: "😐",},
      { srcSet: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.webp", src: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.gif", alt: "😊",},
      { srcSet: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp", src: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif", alt: "🤩",},
    ];
    const emoji = emojiSources[value - 1];
    const filter = isSelected ? "none" : "grayscale(100%)";

    return (
      <picture>
        <source srcSet={emoji.srcSet} type="image/webp" />
        <img
          src={emoji.src}
          alt={emoji.alt}
          width="32"
          height="32"
          style={{ filter }}
        />
      </picture>
    );
    
  };

  const getScaleValue = (questionIndex: number) => {
    const position = positions[questionIndex] || 0;
    const values = [
      "Needs Improvement",
      "Failed to Meet Expectations",
      "Meet Expectations",
      "Exceeds Expectations",
      "Outstanding",
    ];
    return values[position - 1];
  };

  const handleSubmit = async () => {
    try {
      await axios.post(serverUrl + "submit_answer", {
        account_id: globalThis.activeId,
        answer: positions,
        office: selectedOffice[0],
        comment: comment,
        academic_year: acadYear,
        semester: semester
      });
      setCompletedDots((prev) => prev + 1); // Increment the completed dots
      selectedOffice.shift();
      if (selectedOffice.length === 0) {
        setIsSuccessModalOpen(true);
      } else {
        isExternal ? fetchExternalQuestions() : fetchInternalQuestions();
        renderQuestions();
      }
      setPoppingEmoji(null);
      setPositions({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
      });
      setComment(''); // Clear the textarea
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    setView("dashboard"); // Switch to SurveyDashboard
  };

  const renderQuestions = () => {
    return questions.map((question, index) => {
      const questionIndex = index;
      const isAnswered = positions[questionIndex] > 0; // Check if the question is answered
      return (
        <form
          key={questionIndex}
          ref={(el) => (questionRefs.current[questionIndex - 1] = el)}
          className={`bg-gray-100 p-4 rounded-md border-b-2 border-red-800 mb-4 ${isAnswered ? "bg-green-200" : ""}`}
        >
          <p className="text-xs md:text-xs lg:text-lg mb-4 shadow-lg">
            {question.question}
          </p>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                className={getEmojiClass(questionIndex, value)}
                onClick={() => handleEmojiClick(questionIndex, value)}
              >
                {getEmoji(value, positions[questionIndex] === value)}
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

  if (view === "dashboard") {
    return <SurveyDashboard />;
  }

  return (
    <div className=" md:p-6 lg:p-1 max-w-screen-md relative">
      <div className="flex flex-col items-center ">
        {/* Title showing current office or 'External Client' */}
        <div className="title text-lg font-semibold">
           {selectedOffice[currentOfficeIndex]}
        </div>
        {/* PageDots showing progress */}
        <PageDots totalDots={initialTotalDots} completedDots={completedDots} />
      </div>
      <div className="flex flex-col space-y-4 mt-2">
      <div
          className="overflow-y-auto relative max-h-[30vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
          style={{ maxHeight: "30vh" }}
          ref={scrollContainerRef}
        >
          {renderQuestions()}
        </div>
        <form className="bg-gray-100 p-4 rounded-md shadow-md">
          <p className="text-sm md:text-xl lg:text-sm mb-4 shadow-lg">
            Please indicate below your other concerns or suggestions on how we
            can further improve our services
          </p>
          <textarea
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your comments here..."
            className="w-full h-20 border rounded-md p-2"
          ></textarea>
        </form>
      </div>
      {/* PageDots placed above the submit button */}
      <div className="flex flex-col items-center mt-2">
          <button
          onClick={handleSubmit}
          style={{ backgroundColor: "#800000", color: "white" }}
          className="p-2 rounded-md text-white text-xs md:text-sm lg:text-base font-bold mt-2"
        >
          Submit
        </button>
      </div>

      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Survey Completed Successfully!
            </h2>
            <p>Thank you for your feedback.</p>
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyContents;
