import React, { ChangeEvent, useState, useEffect } from "react";
import SurveyContents from "./SurveyContents"; // Import SurveyContents component
import axios from "axios";

interface Offices {
  office_id: string;
  name: string;
}

const SurveyForm: React.FC = () => {
  const [content, setContent] = useState("Instruction");
  const [selectedOffice, setSelectedOffice] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [allOffices, setAllOffices] = useState<Offices[]>([]);
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isExternalClient, setIsExternalClient] = useState(false);

  // Check localStorage when component mounts
  useEffect(() => {
    const showSurvey = localStorage.getItem("ShowSurvey");
    if (showSurvey === "external") {
      setIsExternalClient(true);
    }
  }, []);

  const handleNextClick = () => {
    if (content === "Instruction") {
      const showSurvey = localStorage.getItem("ShowSurvey");
      if (showSurvey === "external") {
        setIsExternalClient(true);
        setContent("Select Offices");
      } else {
        setIsExternalClient(false);
        setContent("Select Offices");
      }
    } else if (content === "Select Offices") {
      localStorage.setItem("selectedOfficeCount", selectedOffice.length.toString());
      if (isExternalClient) {
        setContent("External Client");
      } else {
        setContent("Survey Contents");
      }
    } else if (content === "Survey Contents" && isExternalClient) {
      // Transition to External Client if external survey is active
      setContent("External Client");
    } else if (content === "External Client") {
      // If in External Client section, proceed to survey content
      setContent("Survey Contents");
    }
  };
  


  const handleBackClick = () => {
    if (content === "External Client") {
      setContent("Select Offices");
    } else {
      setContent("Instruction");
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked, name } = event.target;
    if (checked) {
      setSelectedOffice([...selectedOffice, name]);
    } else {
      setSelectedOffice(selectedOffice.filter((office) => office !== name));
    }
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    if (!isCheckAll) {
      setSelectedOffice(allOffices.map((office) => office.name));
      setSelectAll(true);
    } else {
      setSelectedOffice([]);
      setSelectAll(false);
    }
  };

  const getAllOffices = async () => {
    try {
      const response = await axios.get(serverUrl + "office");
      setAllOffices(response.data.offices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOffices();
  }, []);

  return (
    <div className="p-4 md:m-10 lg:m-20">
      {content === "Instruction" ? (
        <>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
            {content}
          </h1>
          <p className="bg-gray-100 rounded-lg border p-4 text-sm md:text-base lg:text-lg">
            We value your feedback! Please share your experience with School
            Student Services by rating us on a scale of 5 (Outstanding) to 1
            (Needs Improvement). Your honest feedback will help us improve our
            services to better meet your needs.
          </p>
          <div className="flex items-center mt-4">
            <label className="text-sm md:text-base lg:text-lg">5</label>
            <img
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.webp"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif"
              alt="🤩"
              className="ml-2 w-6 h-6"
            />
            <span className="ml-2 text-sm md:text-base lg:text-lg">
              Outstanding
            </span>
          </div>
          <div className="flex items-center mt-4">
            <label className="text-sm md:text-base lg:text-lg">4</label>
            <img
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.webp"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.gif"
              alt="😊"
              className="ml-2 w-6 h-6"
            />
            <span className="ml-2 text-sm md:text-base lg:text-lg">
              Exceeds Expectations
            </span>
          </div>
          <div className="flex items-center mt-4">
            <label className="text-sm md:text-base lg:text-lg">3</label>
            <img
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.webp"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif"
              alt="😐"
              className="ml-2 w-6 h-6"
            />
            <span className="ml-2 text-sm md:text-base lg:text-lg">
              Meet Expectations
            </span>
          </div>
          <div className="flex items-center mt-4">
            <label className="text-sm md:text-base lg:text-lg">2</label>
            <img
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f641/512.webp"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f641/512.gif"
              alt="🙁"
              className="ml-2 w-6 h-6"
            />
            <span className="ml-2 text-sm md:text-base lg:text-lg">
              Failed to Meet Expectations
            </span>
          </div>
          <div className="flex items-center mt-4">
            <label className="text-sm md:text-base lg:text-lg">1</label>
            <img
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f614/512.webp"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f614/512.gif"
              alt="😔"
              className="ml-2 w-6 h-6"
            />
            <span className="ml-2 text-sm md:text-base lg:text-lg">
              Needs Improvement
            </span>
          </div>
          <div className="flex justify-end mt-10">
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </>
      ) : content === "Select Offices" ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
              {content}
            </h1>
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={handleSelectAll}
            >
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="flex flex-col space-y-2 m-2">
            {/* List of offices */}
            {allOffices.map((office, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="font-bold ">{office.name}</span>
                <input
                  type="checkbox"
                  name={office.name}
                  value={office.name}
                  checked={selectedOffice.includes(office.name)}
                  onChange={handleCheckboxChange}
                  className="ml-2"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-10">
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg mr-4"
              onClick={handleBackClick}
            >
              Back
            </button>
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </>
      ) : content === "External Client" ? (
        <>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
            External Client Section
          </h1>
          <p className="bg-gray-100 rounded-lg border p-4 text-sm md:text-base lg:text-lg">
            Welcome to the external client section. Layout is for .
          </p>
          <div className="flex justify-end mt-10">
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={() => setContent("Select Offices")}
            >
              Back
            </button>

          </div>
        </>
      ) : (
        <SurveyContents selectedOffice={selectedOffice} />
      )}
    </div>
  );
};

export default SurveyForm;
