import React, { useState } from 'react';
import IconCNSC from '../assets/cnsc_logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoReturnDownBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import host from '../hostingport.txt?raw';
import { useEffect } from 'react';



const LandingPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const serverURl = host.trim();

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');
  const [userType] = useState('Student');
  const [colleges, setColleges] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [block, setBlock] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]); // Holds all department data from the server
  const [courses, setCourses] = useState([]); // Holds courses for the selected department
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Currently selected department
  const [selectedCourse, setSelectedCourse] = useState(""); 

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(serverURl + '/departments'); // Adjust URL as necessary
        const data = await response.json();
        setDepartments(data);  // Set departments and courses from the API response
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);


  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setSelectedDepartment(selectedDept);

    // Find the selected department and set its courses
    const dept = departments.find(department => department.department === selectedDept);
    setCourses(dept ? dept.courses : []); // Update courses based on the selected department
  };



    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true); // Set loading state to true
    
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
          // alert(`Login Successful\nUser Type: ${data.user_type}`);
          localStorage.setItem('ShowSurvey', 'internal'); // Default ShowSurvey setup
    
          switch (data.user_type) {
            case 'student':
              navigate('/student');
              break;
            case 'vpre':
              navigate('/vpre');
              break;
            case 'research-coordinator':
              navigate('/research-coordinator');
              break;
            case 'officehead':
              navigate('/officehead');
              break;
            case 'employee':
              navigate('/employee');
              break;
            case 'others':
              navigate('/others'); // Update this to the appropriate route
              break;
            default:
              alert('Unknown user type. Please contact support.');
          }
        } else {
          alert(`Login Failed: ${data.message}`);
        }
      } catch (error) {
        alert(`An error occurred: ${error.message}`);
      } finally {
        setIsLoading(false); // Set loading state back to false
      }
    };
  
    
  

  const handleInput = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
  
    if (isSignUp) {
      // Gather form data
      const formData = {
        fullName,
        password,
        email,
        userType,
        username,
        colleges,
        year,
        block,
        courses,
        departments,
      };
  
      // For debugging, you can keep this alert temporarily
      alert(JSON.stringify(formData, null, 2));
  
      try {
        // Send data to the backend
        const response = await fetch(serverURl + '/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        // Handle response from backend
        const result = await response.json();
        if (response.ok) {
          alert(result.message);  // Display success message
        } else {
          alert(result.message);  // Show error message (e.g., email already registered)
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during sign-up.');
      }
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

              <div className="relative w-full">
              <input
                      type="text"
                      id="fullname"
                      placeholder=" "
                      className="peer w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Full Name </label>
              </div>
              <div className="relative w-full flex justify-between items-center gap-2 flex-wrap">
            <select
              className="p-2 border rounded flex-grow"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {departments.map((department, index) => (
                <option key={index} value={department.department}>
                  {department.department}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded flex-grow"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded flex-grow"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="First Year">1st Year</option>
              <option value="Second Year">2nd Year</option>
              <option value="Third Year">3rd Year</option>
              <option value="Fourth Year">4th Year</option>
            </select>

            <select
              className="p-2 border rounded flex-grow"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
            >
              <option value="">Select Block</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {!email.endsWith("@gmail.com") && email.length > 0 && (
                  <p className="text-red-500 text-sm">Email must end with @gmail.com</p>
                )}

                <label className="absolute left-4 -top-2 bg-white px-1 text-sm text-gray-500 transform scale-75 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:scale-75 peer-focus:text-red-800" > Email Address </label>
              </div>
            )}

              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md font-semibold transition duration-300 ${
                  isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-800 hover:bg-red-700 text-white'
                }`}
                onClick={isSignUp ? handleInput : handleLogin}
                disabled={isLoading} // Disable the button when loading
              >
                {isLoading ? 'Logging in...' : isSignUp ? 'Sign Up' : 'Login'}
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
