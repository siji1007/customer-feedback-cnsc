import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StartingPage: React.FC = () => {
  const [showTwoButtons, setShowTwoButtons] = useState(false);
  const [showSecondSetOfButtons, setShowSecondSetOfButtons] = useState(false);

  const handleStartClick = () => {
    setShowTwoButtons(true);
  };

  const handleAdminCustomerClick = () => {
    setShowSecondSetOfButtons(true);
  };

  const handleBackClick = () => {
    setShowSecondSetOfButtons(false);
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="left-side flex-1 h-1/2 md:h-full bg-red-800 flex justify-center items-center p-4 md:p-0 md:order-2">
        <img src="src/assets/Reg_CNSC_Logo.png" alt="CNSC LOGO" className="max-w-full max-h-full" />
      </div>
      <div className="right-side flex-1 h-1/2 md:h-full bg-zinc-50 flex justify-center items-center flex-col p-4 md:p-0 md:order-1">
        <p className="text-center">Camarines Norte State College</p>
        <p className="mb-10 text-center">Customer Feedback System</p>
        <div className="h-20 w-20 bg-black mb-20"></div> {/* add the logo here */}
        {!showTwoButtons ? (
          <button
            className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full"
            onClick={handleStartClick} 
          >
            Start
          </button>
        ) : showSecondSetOfButtons ? (
          <div className="flex flex-col items-center">
            <Link to="/admin">   
              <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full m-2">
                VPRE
              </button>
            </Link>
            <button className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full m-2">
              Office Head
            </button>
            <button
              className="w-40 text-black bg-white-500 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full m-2 mt-4"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button
              className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full m-2"
              onClick={handleAdminCustomerClick}
            >
              Admin
            </button>
            <Link to="/customer">
              <button
                className="w-40 text-white bg-red-900 hover:bg-red-800 hover:text-white font-bold py-2 px-4 rounded-full m-2"
            
              >
                Customer
              </button>
            </Link>
          </div>
        )}
        <p className="mt-2 text-center">We want to hear from you.</p>
      </div>
    </div>
  );
};

export default StartingPage;
