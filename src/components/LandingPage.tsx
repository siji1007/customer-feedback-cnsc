import React, { useState } from 'react';
import IconCNSC from '../assets/cnsc_logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoReturnDownBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import host from '../hostingport.txt?raw';



const LandingPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const serverURl = host.trim();
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(serverURl + '/login_new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`Login Successful\nUser Type: ${data.user_type}`);
  
        // Navigate based on user_type
        if (data.user_type === 'Student') {
          localStorage.setItem('ShowSurvey', 'internal');
          navigate('/student');
        } else {
          navigate('/vpre'); // Default navigation for other user types
        }
      } else {
        alert(`Login Failed: ${data.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };
  
  

  return  (
  <>
    {/* <header className="w-full fixed top-0 bg-red-900 flex justify-between items-center px-4 h-auto z-20 shadow-lg">
      <div className="flex items-center">
        <img src={IconCNSC} alt="Logo" className="h-16 w-16 object-contain p-2" />
        <div className="flex flex-col justify-center">
          <h1
            className="text-white text-sm sm:text-sm md:text-sm lg:text-base font-bold"
            style={{ borderBottom: '2px solid gold' }}
          >
            Camarines Norte State College
          </h1>
          <h1 className="text-white text-xs sm:text-sm md:text-xs lg:text-base font-bold">
            Client Feedback System
          </h1>
        </div>
      </div>
    </header> */}

    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(src/assets/landingbg.jpg)" }}
    >
      <div className="absolute inset-0 bg-red-800 bg-opacity-40"></div>
      <div className=" z-10 flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-11/12 max-w-4xl">
      
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center bg-red-800 text-white p-8 md:w-1/2">
          <h1 className="text-xl md:text-2xl lg:text-2xl font-bold mb-4"> Camarines Norte State College </h1>
          <p className="text-sm text-white-200 mb-8 text-center font-semibold">
            Client Satisfaction Feedback System
          </p>
          <div className="relative w-full h-48 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="absolute inset-0 w-full h-full" > <circle cx="250" cy="250" r="200" fill="#fff" /> <circle cx="250" cy="250" r="190" fill="maroon" /> </svg>
            <img
              src={IconCNSC}
              alt="CNSC Logo"
              className="absolute w-24 h-24 object-contain"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 flex flex-col justify-center md:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            {isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
          </h2>

          <form className="flex flex-col gap-6">
            {isSignUp && (
              <>

              <select className="p-2 border rounded">
                  <option value="">Select User Type</option>
                  <option value="course1">Student</option>
                  <option value="course2">Employee</option>
                </select>
              <div className="relative w-full">
                <input
                  type="text"
                  id="fullname"
                  placeholder=" "
                  className="peer w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Full Name </label>
              </div>
              <div className="relative w-full flex justify-between items-center ">

                <select className="p-2 border rounded">
                  <option value="">Select Course</option>
                  <option value="course1">BSIT</option>
                  <option value="course2">BSIS</option>
                  <option value="course3">BSCE</option>
                </select>

                <select className="p-2 border rounded">
                  <option value="">Select Year</option>
                  <option value="year1">First Year</option>
                  <option value="year2">Second Year</option>
                  <option value="year3">Third Year</option>
                  <option value="year3">Fourth Year</option>
                </select>

                <select className="p-2 border rounded">
                  <option value="">Select Block</option>
                  <option value="blockA">Block A</option>
                  <option value="blockB">Block B</option>
                  <option value="blockC">Block C</option>
                </select>
                </div>
              </>
            )}
        

            <div className="relative w-full">
            <input
                  type="text"
                  id="username"
                  placeholder=" "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Username </label>
            </div>

            <div className="relative w-full">
            <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Password </label>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5 text-red-800" /> : <FaEye className="w-5 h-5 text-red-800" />}
              </button>
            </div>

            {isSignUp && (
              <div className="relative w-full">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  className="peer w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Email Address </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-800 text-white rounded-md font-semibold hover:bg-red-700 transition duration-300" onClick={handleLogin}
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <div className="mt-4 flex justify-between text-sm">
            {!isSignUp && (
              <a  className="text-red-600 hover:underline">
                Forgot password?
              </a>
            )}
           <button
            className="text-red-600 hover:underline focus:outline-none"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? (
              <>
                <IoReturnDownBack className="inline mr-2" />
                Back to Login
              </>
            ) : (
              'Create Account'
            )}
          </button>

          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LandingPage;
