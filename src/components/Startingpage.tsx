import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const StartingPage: React.FC = () => {
  const location = useLocation();
  const [showTwoButtons, setShowTwoButtons] = useState(false);
  const [showSecondSetOfButtons, setShowSecondSetOfButtons] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const showSecondSet = queryParams.get('showSecondSetOfButtons') === 'true';
    setShowSecondSetOfButtons(showSecondSet);
    setShowTwoButtons(showSecondSet);
  }, [location.search]);

  const handleStartClick = () => {
    setShowTwoButtons(true);
  };

  const handleBackClick = () => {
    setShowSecondSetOfButtons(false);
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="left-side flex-1 h-1/2 md:h-full bg-red-800 flex justify-center items-center p-4 md:p-0 md:order-2">
        <img src="src/assets/cnsc_logo.png" alt="CNSC LOGO" className="max-w-full max-h-full" />
      </div>
      <div className="right-side flex-1 h-1/2 md:h-full  flex justify-start md:justify-center items-center flex-col m-10 md:p-0 md:order-1">
        <p  className="text-center font-bold text-md" style={{ fontFamily: 'Copperplate, serif' }}>Camarines Norte State College</p>
        <p  className="text-center font-bold text-md mb-10" style={{ fontFamily: 'Copperplate, serif' }}>Customer Feedback System</p>
        {!showTwoButtons ? (
          <>
         
            <button
              className="w-40 text-black bg-gray-300  hover:bg-gray-100 hover:text-gray-800 font-bold py-2 px-4 rounded-full shadow-maroon "
              onClick={handleStartClick}
            >
              Start
            </button>
          </>
        ) : showSecondSetOfButtons ? (
          <div className="flex flex-col items-center">
            <Link to="/admin?form=administrator">
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-lg m-2">
                VPRE
              </button>
            </Link>
            <Link to="/admin?form=officehead">
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-lg m-2">
                Office Head
              </button>
            </Link>
            <button
              className="w-40 text-black bg-white-500   font-bold py-2 px-4 rounded-full m-2 mt-4"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
        ) : (
<div className="flex flex-row sm:flex-row sm:space-x-4">
  <div className="flex flex-col items-center flex flex-col items-center sm:mt-0">
    <button
      className="w-24 h-24 sm:w-32 sm:h-32 text-white bg-gray-300 hover:bg-gray-100 font-bold rounded-lg m-2 flex items-center justify-center shadow-maroon"
      onClick={() => setShowSecondSetOfButtons(true)}
    >
      <img src="src/assets/admin.png" alt="Admin Icon" className="w-8 h-8 sm:w-10 sm:h-10" />
    </button>
    <span className="text-center mt-2 text-black font-bold">Admin</span>
  </div>
  <div className="flex flex-col items-center flex flex-col items-center sm:mt-0"> {/* Adjust margin for mobile */}
    <Link to="/customer">
      <button
        className="w-24 h-24 sm:w-32 sm:h-32 text-white bg-gray-300 hover:bg-gray-100 font-bold rounded-lg m-2 flex items-center justify-center shadow-maroon"
      >
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
