import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import VPREPage from './VPRE'; // Import VPREPage component

const AdminLogins: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const formType = queryParams.get('form');
  
  // State to manage whether to show the login form or VPREPage
  const [showLoginForm, setShowLoginForm] = useState(true);

  const handleProceedClick = () => {
    // Navigate to VPREPage or perform any other action
    setShowLoginForm(false); // Set state to hide login form
  };

  const handleBackClick = () => {
    navigate('/?showSecondSetOfButtons=true');
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
        {showLoginForm && formType === 'administrator' && (
          <form className="flex flex-col items-center justify-center">
            <h1>ADMINISTRATOR</h1>
            <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
              <section className="flex justify-between items-center mb-4">
                <label htmlFor="studentId" className="w-1/3 text-sm sm:text-base md:text-lg">Username</label>
                <input type="text" id="studentId" className="w-2/3 rounded-lg border" required />
              </section>
              <section className="flex justify-between items-center mb-4">
                <label htmlFor="password" className="w-1/3 text-sm sm:text-base md:text-lg">Password</label>
                <input type="password" id="password" className="w-2/3 rounded-lg border" required />
              </section>
            </div>
            <button type="button" onClick={handleProceedClick} className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full">PROCEED</button>
            <button type="button" className="mt-4 px-4 py-2 text-black w-full" onClick={handleBackClick}>Back</button>
          </form>
        )}

        {showLoginForm && formType === 'officehead' && (
          <form className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">OFFICE HEAD</h1>
            <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
              <section className="flex justify-between items-center mb-4">
                <label htmlFor="department" className="w-1/3 text-sm sm:text-base md:text-lg m-2">Department</label>
                <select id="department" className="w-2/3 rounded-lg border" required>
                  <option value="">Select Department</option>
                  <option value="Computer Studies">Computer Studies</option>
                  <option value="Accountancy">Accountancy</option>
                </select>
              </section>
              <section className="flex justify-between items-center mb-4">
                <label htmlFor="password" className="w-1/3 text-sm sm:text-base md:text-lg m-2">Password</label>
                <input type="password" id="password" className="w-2/3 rounded-lg border" required />
              </section>
            </div>
            <button type="button" onClick={handleProceedClick} className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full">PROCEED</button>
            <button type="button" className="mt-4 px-4 py-2 text-black w-full" onClick={handleBackClick}>Back</button>
          </form>
        )}

        {/* Conditional rendering of VPREPage */}
        {!showLoginForm && (
          <VPREPage />
        )}
      </main>

      <footer className="w-full h-33 bg-red-900 flex justify-between p-2">
        <div className="flex-1">
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

        <div className="ml-2">
          <p className="text-white font-bold">Help</p>
          <div className="flex">
            <FaFacebook className="text-white text-xl cursor-pointer hover:text-blue-500 mr-4" />
            <FaTwitter className="text-white text-xl cursor-pointer hover:text-blue-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogins;
