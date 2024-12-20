import React, { ChangeEvent, useState, useEffect } from "react";
import SurveyContents from "./SurveyContents";
import axios from "axios";
import hosting from "../../hostingport.txt?raw";
import iconCNSC from '../../assets/cnsc_logo.png';
import { useNavigate } from "react-router-dom";
import { IoReturnDownBack } from "react-icons/io5";
import { IoIosReturnRight } from "react-icons/io";

interface Offices {
  office_id: string;
  name: string;
}

const SurveyForm: React.FC = () => {
  const [content, setContent] = useState("Instruction");
  const [selectedOffice, setSelectedOffice] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [allOffices, setAllOffices] = useState<Offices[]>([]);
  const serverUrl = hosting.trim();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleNextClick = () => {
    if (content === "Instruction") {
      setContent("Select Offices");
    } else if (content === "Select Offices") {
      localStorage.setItem("selectedOfficeCount", selectedOffice.length.toString());
      setContent("Survey Contents");
    }
  };

  const handleBackClick = () => {
    setContent("Instruction");
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
      const response = await axios.get(serverUrl + "/office");
      setAllOffices(response.data.offices);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOffices();
  }, []);

  const handleLogout = () => {
    // Clear localStorage (if used for storing credentials)
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  
    // Clear sessionStorage (if used for temporary storage)
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
  
    // If you're storing credentials in cookies, clear them
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  
 
    // Close or reset the survey form (if applicable)
    setShowSurveyForm(false);
  
    // Navigate to the home page or login page
    navigate('/');
  };
  
  return (
    <>
      {/* Header */}
      <header className="w-full h-19 bg-red-900 flex justify-between items-center px-4">
        <div className="flex items-center">
          <img src={iconCNSC} alt="Logo" className="h-16 w-16 object-contain" />
          <div className="ml-4 flex flex-col justify-center">
            <h1
              className="text-white text-sm sm:text-sm md:text-sm lg:text-xm font-bold"
              style={{ borderBottom: '2px solid gold' }}
            >
              Camarines Norte State College
            </h1>
            <h1 className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">
              Client Feedback System
            </h1>
          </div>
        </div>
        {showSurveyForm && (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 font-bold ml-auto"
          >
            Logout
          </button>
        )}
      </header>

      {/* Content */}
      <div className="flex-grow flex justify-center items-center flex-col overflow-auto m-3 ">

        {content === "Instruction" && (
           <div className="flex-grow flex justify-center flex-col overflow-auto m-3">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">
            {content}
          </h1>
          <p className="bg-gray-100 rounded-lg border p-4 text-sm md:text-base lg:text-lg">
            We value your feedback! Please share your experience with School
            Student Services by rating us on a scale of 5 (Outstanding) to 1
            (Needs Improvement). Your honest feedback will help us improve our
            services to better meet your needs.
          </p>
          {/* Rating options */}
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
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={handleNextClick}
            >
              Next
              <IoIosReturnRight  className="inline mr-2" />
            </button>
          </div>
          </div>
        )}

        {content === "Select Offices" && (
         <div className="flex-grow flex justify-center flex-col overflow-x-hidden w-full">
          <div className="flex justify-between items-center mb-2 ">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
              {content}
            </h1>
            <div className="flex items-center ml-4">
              <span className="text-sm md:text-base lg:text-lg mr-2">
                {selectAll ? "Deselect All" : "Select All"}
              </span>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="ml-2"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2 m-2">
            {/* List of offices */}
            {allOffices.map((office, index) => (
              <label key={index} className="flex items-center justify-between">
                <span className="font-bold">{office.name}</span>
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
              <IoReturnDownBack className="inline mr-2" />

              Back
            </button>
            <button
              className="px-4 py-2 text-black rounded-lg text-sm md:text-base lg:text-lg"
              onClick={handleNextClick}
            >
              Next
              <IoIosReturnRight  className="inline mr-2" />
            </button>
          </div>
        </div>
        )}

        {content === "Survey Contents" && (
          
          <SurveyContents
            selectedOffice={selectedOffice}
            setContent={setContent}
          />
        )}
      </div>
    </>
  );
};

export default SurveyForm;
