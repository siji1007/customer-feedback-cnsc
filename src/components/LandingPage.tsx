import React, { useState } from 'react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import StudentLogin from './Logins/StudentLogin';
import EmployeeLogin from './Logins/EmployeeLogin';
import OtherLogin from './Logins/OthersLogin';

const LandingPage: React.FC = () => {
  const [selectedLogin, setSelectedLogin] = useState<string>('');

  const handleLoginSelection = (loginType: string) => {
    setSelectedLogin(loginType);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-20 bg-red-900 flex justify-between items-center px-4">
        <div className="flex items-center">
          <img src="src/assets/Reg_CNSC_Logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          <div className="ml-4 flex flex-col justify-center">
            <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">Camarines Norte State College</h1>
            <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">Customer Feedback System</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center overflow-auto">
        {selectedLogin === '' && (
          <nav className="flex flex-col p-10 space-y-4 ">
            <h1 className="m-10 text-2xl md:text-3xl lg:text-4xl font-bold ">CUSTOMERS</h1>
            <button className=" bg-red-900 text-white py-2 px-4 rounded-full " onClick={() => handleLoginSelection('student')}>
              Student
            </button>
            <button className="bg-red-900 text-white py-2 px-4 rounded-full " onClick={() => handleLoginSelection('employee')}>
              Employee
            </button>
            <button className="bg-red-900 text-white py-2 px-4 rounded-full " onClick={() => handleLoginSelection('other')}>
              Others
            </button>

            <button className="text-black text-sm sm:text-base md:text-lg lg:text-xl " onClick={() => window.history.back()}>
            Back
            </button>
          </nav>
        )}
        {selectedLogin === 'student' && <StudentLogin />}
        {selectedLogin === 'employee' && <EmployeeLogin />}
        {selectedLogin === 'other' && <OtherLogin />}
      </main>

      <footer className="w-full h-33 bg-red-900 flex justify-between  p-2">
  <div className='flex-1'>
    <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">Contact Information</h1>
    <p className="text-white text-xs sm:text-xxs md:text-xs lg:text-xm">
      Camarines Norte State College Information Technology Services Office<br />
      F. Pimentel Avenue, Daet, 4600 Camarines Norte, Philippines <br />
      Telephone No.(054)721-2672 or 440-1199 <br />
      PICRO Mobile No. 09688983078 | 09171439973 <br />
      Mobile No. 09990042147 <br />
      Email: <span className="underline">president@cnsc.edu.ph</span>
    </p>
  </div>

    <div className='ml-2' >
        <p className="text-white font-bold m">Help</p>
        <div className='flex'>
            <FaFacebook className="text-white text-xl cursor-pointer hover:text-blue-500 mr-4" />
            <FaTwitter className="text-white text-xl cursor-pointer hover:text-blue-500" />
    </div>
    </div>
</footer>

    </div>
  );
};

export default LandingPage;