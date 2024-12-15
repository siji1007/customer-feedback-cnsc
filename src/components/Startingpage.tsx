import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cnsc_logo from "../assets/cnsc_logo.png";
import mission from "../assets/mission.png";
import vision from "../assets/vision.png";
const StartingPage: React.FC = () => {
  const location = useLocation();
  const [showTwoButtons, setShowTwoButtons] = useState(false);
  const [showSecondSetOfButtons, setShowSecondSetOfButtons] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsAgreed(event.target.checked);
  };


  
  const imageSources = [              //This is the image slider you can store here the image of latest events. 
    cnsc_logo,                       
    mission,
    vision,
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const showSecondSet = queryParams.get('showSecondSetOfButtons') === 'true';    //This is to show the buttons to show type of user
    setShowSecondSetOfButtons(showSecondSet);
    setShowTwoButtons(showSecondSet);
  }, [location.search]);


  const handleStartClick = () => {        //Function to handle the Start Button 
    setShowTwoButtons(true);
  };

  const handleBackClick = () => {         //Function for back Buttons
    setShowSecondSetOfButtons(false);
  };

  return (
    <div className="flex h-screen justify-center items-center flex-col md:flex-row">

      {/* Right Side with Sliding Images */}
      <div className="left-side flex-1 h-1/2 md:h-full bg-red-800 flex justify-center items-center relative overflow-hidden md:order-2">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {imageSources.map((src, index) => ( 
            <div key={index} className="flex-shrink-0 w-full h-full flex justify-center items-center">
              <img src={src} alt="CNSC LOGO" className="max-w-full max-h-full object-cover"  loading="lazy"/>
            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-4 flex justify-center w-full space-x-2">
          {imageSources.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-gray-300' : 'bg-gray-500'} transition-all duration-300`}
            ></div>
          ))}
        </div>
      </div>

      {/* Left Side with Buttons */}
      <div className="right-side flex-1 h-1/2 md:h-full flex justify-start md:justify-center items-center flex-col m-10 md:p-0 md:order-1">
        <p className="text-center font-bold text-md" > Camarines Norte State College </p>
        <p className="text-center font-bold text-md mb-10" >Customer Feedback System</p>
        {!showTwoButtons ? (
          <>
            <button
              className="w-40 text-black bg-gray-300 hover:bg-gray-100 hover:text-gray-800 font-bold py-2 px-4 rounded-full shadow-maroon"
              onClick={handleStartClick} disabled={!isAgreed}
            >
              Start
            </button>
            <div className="text-center mt-5  sm:px-6 lg:px-8">
              <div className="mb-4 flex justify-center items-center">
                <label className="flex items-center text-sm sm:text-base">
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={isAgreed}
                    onChange={handleCheckboxChange}
                  />
                  <span className="ml-2 text-justify">
                    By starting, you are agreeing to our&nbsp;
                    <a
                      href="/terms-of-use"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-900 underline hover:text-blue-700"
                    >
                      Terms of Use
                    </a>
                    &nbsp;and our&nbsp;
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-900 underline hover:text-blue-700"
                    >
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>
            </div>
          </>
        ) : showSecondSetOfButtons ? (
          <div className="flex flex-col items-center">
            <Link to="/admin?form=administrator">
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-lg m-2">
                VPRE
              </button>
            </Link>
            <Link to="/admin?form=ResearchCoordinator">
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-lg m-2">
                Research Coordinator
              </button>
            </Link>
            <Link to="/admin?form=officehead">
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-lg m-2">
                Offices
              </button>
            </Link>
            <button
              className="w-40 text-black bg-white-500 font-bold py-2 px-4 rounded-full m-2 mt-4"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex flex-row sm:flex-row sm:space-x-4">
            <div className="flex flex-col items-center">
              <button
                className="w-24 h-24 sm:w-32 sm:h-32 text-white bg-gray-300 hover:bg-gray-100 font-bold rounded-lg m-2 flex items-center justify-center shadow-maroon"
                onClick={() => setShowSecondSetOfButtons(true)}
              >
                <img src="src/assets/admin.png" alt="Admin Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
              </button>
              <span className="text-center mt-2 text-black font-bold">Admin</span>
            </div>
            <div className="flex flex-col items-center">
              <Link to="/customer">
                <button className="w-24 h-24 sm:w-32 sm:h-32 text-white bg-gray-300 hover:bg-gray-100 font-bold rounded-lg m-2 flex items-center justify-center shadow-maroon">
                  <img src="src/assets/customer.png" alt="Customer Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
                </button>
              </Link>
              <span className="text-center mt-2 text-black font-bold">Customer</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartingPage;
