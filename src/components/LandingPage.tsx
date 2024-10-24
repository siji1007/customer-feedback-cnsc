import React, { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StudentLogin from './Logins/StudentLogin';
import EmployeeLogin from './Logins/EmployeeLogin';
import OtherLogin from './Logins/OthersLogin';
import SurveyForm from './Logins/SurveyForm';
import IconCNSC from '../assets/cnsc_logo.png';




const LandingPage: React.FC = () => {
  const [selectedLogin, setSelectedLogin] = useState<string>('');               //show here the selected login form
  const [showSurveyForm, setShowSurveyForm] = useState<boolean>(false);         
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);                

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleLoginSelection = (loginType: string) => {         //function for login form selection (Student,Employee and Other)
    setSelectedLogin(loginType);
  };

  const handleShowSurveyForm = () => {                         //Show the survey form if login success
    setShowSurveyForm(true);
  };

  const toggleFooter = () => {                                //Footer, this is for toggle to make it visible or not
    setIsFooterVisible(!isFooterVisible);
  };


  const handleLogout = () =>{
    setShowSurveyForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-19 bg-red-900 flex justify-between items-center px-4">
        <div className="flex items-center">
          <img src={IconCNSC} alt="Logo" className="h-16 w-16 object-contain" />
          <div className="ml-4 flex flex-col justify-center">
            <h1 className="text-white text-sm sm:text-sm md:text-sm lg:text-xm font-bold"
                style={{ borderBottom: '2px solid gold' }}>
              Camarines Norte State College
            </h1>
            <h1 className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">Client Feedback System</h1>
          </div>
        </div>
            {/* Conditionally render logout button */}
            {showSurveyForm && (
          <button
          onClick={handleLogout}
            className="text-white hover:text-gray-300 font-bold ml-auto"
          >
            Logout
          </button>
        )}
      </header>

      {/* Main class where we store the login Forms and Survey Form*/}
      <main className="flex-grow flex flex-col justify-center items-center overflow-auto h-min-screen m-5">
        {!showSurveyForm && selectedLogin === '' && (
          <nav className="flex flex-col space-y-4 p-10 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center m-3">CLIENTS</h1>
            <button className="bg-red-900 text-white py-2 px-4 rounded-lg" onClick={() => handleLoginSelection('student')}>
              Student
            </button>
            <button className="bg-red-900 text-white py-2 px-4 rounded-lg" onClick={() => handleLoginSelection('employee')}>
              Employee
            </button>
            <button className="bg-red-900 text-white py-2 px-4 rounded-lg" onClick={() => handleLoginSelection('other')}>
              Others
            </button>
            <Link to="/?showTwoButtons=false" className="text-center">
              <button className="text-black text-sm sm:text-base md:text-lg lg:text-xl">
                Back
              </button>
            </Link>
          </nav>
        )}

        {!showSurveyForm && selectedLogin === 'student' && <StudentLogin onLoginSuccess={handleShowSurveyForm} />}
        {!showSurveyForm && selectedLogin === 'employee' && <EmployeeLogin onLoginSuccess={handleShowSurveyForm} />}
        {!showSurveyForm && selectedLogin === 'other' && <OtherLogin onLoginSuccess={handleShowSurveyForm} onBack={function (): void {
          throw new Error('Function not implemented.');
        } } />}
        {showSurveyForm && <SurveyForm />}

      </main>

      {/* Footer */}
      {isFooterVisible && (
        <footer className="w-full h-33 bg-red-900 flex flex-none justify-between p-2">
        <div className="flex-1 ">
          <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xs font-bold">Contact Information</h1>
          <p className="text-white text-xs sm:text-xxs md:text-xxs lg:text-xxs">
            Camarines Norte State College Information Technology Services Office<br />
            F. Pimentel Avenue, Daet, 4600 Camarines Norte, Philippines <br />
            Telephone No.(054)721-2672 or 440-1199 <br />
            PICRO Mobile No. 09688983078 | 09171439973 <br />
            Mobile No. 09990042147 <br />
            Email: <span className="underline">president@cnsc.edu.ph</span>
          </p>
        </div>
        <div className="ml-2">
          <p className="text-white text-xs font-bold text-center mb-2 ">Help</p>
          <div className="flex">
            <FaFacebook className="text-white text-xl cursor-pointer hover:text-blue-500 mr-2" />
            <FaTwitter className="text-white text-xl cursor-pointer hover:text-blue-500" />
          </div>
        </div>
      </footer>
      )}

      {/* Arrow Buttons */}
      <div className="fixed bottom-0 w-full flex justify-between px-4">
        {!isFooterVisible && (
          <button
            onClick={toggleFooter}
            className="text-black text-xl bg-white p-2 rounded-l-lg shadow-md fixed bottom-5 right-2 m-2"
          >
            <FaArrowUp />
          </button>
        )}
        {isFooterVisible && (
          <button
            onClick={toggleFooter}
            className="text-red-800 text-xl p-2 rounded-l-lg shadow-md fixed bottom-5 right-2 m-2 bg-white"
          >
            <FaArrowDown />
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
