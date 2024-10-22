import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, useMatch } from "react-router-dom";
import { FaFacebook, FaTwitter, FaArrowDown, FaArrowUp  } from "react-icons/fa";
import cnscLogo from '../../assets/cnsc_logo.png';
import axios from "axios";
import { FaArrowDownLong } from "react-icons/fa6";

interface AdminCredentials {
  admin_username: string;
  admin_password: string;
}

interface OfficeHeadCredentials {
  officeHead_department: string;
  officeHead_password: string;
}

interface Office {
  id: string;
  name: string;
}
interface AdminLoginsProps {
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
}

const AdminLogins: React.FC<AdminLoginsProps> = ({ showLoginForm, setShowLoginForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const formType = queryParams.get("form") || localStorage.getItem('formType');
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleFooter = () => {
    setIsFooterVisible(prev => !prev);
  };

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    admin_username: "",
    admin_password: "",
  });
  const [officeHeadCredentials, setOfficeHeadCredentials] =
    useState<OfficeHeadCredentials>({
      officeHead_department: "",
      officeHead_password: "",
    });
  const [hasError, setHasError] = useState(false);

  const [offices, setOffices] = useState<Office[]>([]);

  const handleBackClick = () => {
    navigate("/?showSecondSetOfButtons=true");
    localStorage.removeItem('formType');
  };

 
  const handleLogout = async () => {
    try {
        // Call the logout endpoint on the server
        await axios.post(serverUrl + "logout", {}, { withCredentials: true });
        
        // Clear local storage and navigate to the login page
        localStorage.removeItem('formType');
        navigate(`/admin?form=administrator`);  // Adjust if you have other forms
        setShowLoginForm(true);
    } catch (error) {
        console.error("Logout error:", error);
    }
};

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };


  const handleSignInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminCredentials({
      ...adminCredentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleAdminSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        setHasError(false);
        localStorage.setItem('formType', 'administrator');
        
        const response = await axios.post(
            serverUrl + "verify-admin",
            adminCredentials,
            { withCredentials: true }  
        );

        console.log("Response:", response);  
        console.log("Response status:", response.status);  

        if (response.status === 200) {
            setShowLoginForm(false);
            navigate("/admin/vpre"); 
        }
    } catch (error) {
        console.error("Error during sign-in:", error);  
        setHasError(true);
    }
};

  const handleOHSignInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOfficeHeadCredentials({
      ...officeHeadCredentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleOfficeHeadSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      setHasError(false);
      setShowLoginForm(false);
      localStorage.setItem('formType', 'officehead');
      navigate("/admin/officehead"); 
      const response = await axios.post(
        serverUrl + "verify_oh",
        officeHeadCredentials
      );
      setHasError(false);
      setShowLoginForm(false);
      navigate("/admin/officehead"); // Navigate to the OfficeHead page
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(serverUrl + "office");
        setOffices(response.data.offices);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formType) {
      localStorage.setItem('formType', formType);
    }
  }, [formType]);

  const isAdminLogin = useMatch("/admin");
  const isOfficeHeadLogin = useMatch("/admin/officehead");

  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full  bg-red-900 flex justify-between items-center px-4 h-auto">
        <div className="flex items-center">
        <img  src={cnscLogo} alt="Logo" className="h-16 w-16 object-contain p-2" />
          <div className="ml-4 flex flex-col justify-center">
          <h1 className="text-white text-sm sm:text-sm md:text-sm lg:text-xm font-bold "
          style={{ borderBottom: '2px solid gold' }}>
              Camarines Norte State College
          </h1>

            <h1 className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">Client Feedback System</h1>
          </div>
        </div>
        {/* Conditionally render logout button */}
        {!showLoginForm && (
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 font-bold ml-auto"
          >
            Logout
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col justify-center items-center overflow-y-auto overflow-x-hidden">
        {showLoginForm && formType === "administrator" && (
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handleAdminSignIn}
          >
            <h1 className="text-2xl font-bold mb-4">ADMINISTRATOR</h1>
            <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
              <section className="flex justify-between items-center mb-4">
                <label
                  htmlFor="adminId"
                  className="w-1/3 text-sm sm:text-base md:text-lg"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="adminId"
                  className={`${"w-2/3 rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                  name="admin_username"
                  value={adminCredentials.admin_username}
                  onChange={handleSignInChange}
                  required
                />
              </section>
              <section className="flex justify-between items-center mb-4">
                <label
                  htmlFor="password"
                  className="w-1/3 text-sm sm:text-base md:text-lg"
                >
                  Password
                </label>
                <div className="w-2/3 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="admin_password"
                    id="password"
                    className={`${"w-full rounded-lg border pr-10"} ${hasError ? "border-red-500" : ""}`}
                    value={adminCredentials.admin_password}
                    onChange={handleSignInChange}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 px-3 py-1 text-sm font-bold text-red-800"
                    type="button"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                
              </section>
              <h4
                className={`${"text-sm text-center text-red-500"} ${hasError ? "" : "hidden"}`}
              >
                Admin credentials not found
              </h4>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg w-full font-bold"
            >
              PROCEED
            </button>
            <button
              type="button"
              className="mt-4 px-4 py-2 text-black w-full"
              onClick={handleBackClick}
            >
              Back
            </button>
          </form>
        )}
        {showLoginForm && formType === "officehead" && (
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={handleOfficeHeadSignIn}
          >
            <h1 className="text-2xl font-bold mb-4">OFFICE HEAD</h1>
            <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
              <section className="flex justify-between items-center mb-4">
                <label
                  htmlFor="department"
                  className="w-1/3 text-sm sm:text-base md:text-lg m-2"
                >
                  Department
                </label>
                <select
                  id="department"
                  className="w-2/3 rounded-lg border"
                  name="officeHead_department"
                  value={officeHeadCredentials.officeHead_department}
                  onChange={handleOHSignInChange}
                  required
                >
                  <option value="">Select Department</option>

                  {offices.map((office) => (
                    <option key={office.id} value={office.name}>
                       {office.name}
                   </option>
                   
    
                  ))} 
                   
                </select>
              </section>
              <section className="flex justify-between items-center mb-4">
                <label
                  htmlFor="password"
                  className="w-1/3 text-sm sm:text-base md:text-lg m-2"
                >
                  Password
                </label>
                <div className="w-2/3 relative">
                  <input
                    type={showPassword ? "text":"password"}
                    id="password"
                    className={`${"w-full rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                    name="officeHead_password"
                    value={officeHeadCredentials.officeHead_password}
                    onChange={handleOHSignInChange}
                    required
                  />
                  <button className="absolute  inset-y-0 right-0 px-3 py-1 text-sm font-bold text-red-800 "
                    type="button"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </section>
              <h4
                className={`${"text-sm text-center text-red-500"} ${hasError ? "" : "hidden"}`}
              >
                Office Head credentials not found
              </h4>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg w-full"
            >
              PROCEED
            </button>
            <button
              type="button"
              className="mt-4 px-4 py-2 text-black w-full"
              onClick={handleBackClick}
            >
              Back
            </button>
          </form>
        )}
      {!showLoginForm &&
          <div className="flex-grow w-full flex main-content">
          <Outlet />
            </div>
       } {/* Render nested routes here */}
      </main>

      <footer
  className={`fixed bottom-0 w-full bg-red-900 p-2 transition-transform ${isFooterVisible ? "transform-none" : "transform translate-y-full"}`}
>
  {/* Arrow Buttons */}
  <div className="fixed bottom-0 w-full flex justify-between px-4">
    {!isFooterVisible && (
      <button 
        onClick={toggleFooter} 
        className="text-black text-xl bg-white p-2 rounded-l-lg shadow-md fixed bottom-5 right-2 m-2"
      >
        <FaArrowUp/>
      </button>
    )}
    {isFooterVisible && (
      <button 
        onClick={toggleFooter} 
        className="text-white text-xl fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-900 p-2 rounded-lg shadow-md"
      >
        <FaArrowDown />
      </button>
    )}
  </div>

  {/* Footer Content */}
  {isFooterVisible && (
    <div className="flex flex-col items-center">
      <div className="flex-1 flex justify-between w-full">
        <div className="flex-1">
          <h1 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold">
            Contact Information
          </h1>
          <p className="text-white text-xs sm:text-xxs md:text-xs lg:text-xm">
            Camarines Norte State College Information Technology Services Office
            <br />
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
      </div>
    </div>
  )}
</footer>

    </div>
  );
};

export default AdminLogins;
