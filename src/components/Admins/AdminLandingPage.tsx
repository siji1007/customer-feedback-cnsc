import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet, useMatch } from "react-router-dom";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import axios from "axios";

interface AdminCredentials {
  admin_username: string;
  admin_password: string;
}

interface OfficeHeadCredentials {
  officeHead_department: string;
  officeHead_password: string;
}

const AdminLogins: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const formType = queryParams.get("form") || localStorage.getItem('formType');
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;

  // State to manage which form is shown and which component to display
  const [showLoginForm, setShowLoginForm] = useState(true);
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

  const [departments, setDepartments] = useState<string[]>([]);

  const handleBackClick = () => {
    navigate("/?showSecondSetOfButtons=true");
    localStorage.removeItem('formType');
  };

 
  const handleLogout = () => {
    const savedFormType = localStorage.getItem('formType');
    if (savedFormType) {
      navigate(`/admin?form=${savedFormType}`);
      setShowLoginForm(true);
    }
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
      //setHasError(false);
      //setShowLoginForm(false);
      //localStorage.setItem('formType', 'administrator');
      //navigate("/admin/vpre");
      const response = await axios.post(
        serverUrl + "verify-admin",
        adminCredentials
      );
      setHasError(false);
      setShowLoginForm(false);
  
      navigate("/admin/vpre"); // Navigate to the VPREPage
      
    } catch (error) {
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
      //setHasError(false);
      //setShowLoginForm(false);
      //localStorage.setItem('formType', 'officehead');
      //navigate("/admin/officehead"); 
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
        const response = await axios.get(serverUrl + "service_department");
        setDepartments(response.data.departments);
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
      <header className="w-full  bg-red-900 flex justify-between items-center px-4">
        <div className="flex items-center m-2">
        <img src="src/assets/cnsc_logo.png" alt="Logo" className="h-16 w-16 object-contain" />
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
                <input
                  type="password"
                  name="admin_password"
                  id="password"
                  className={`${"w-2/3 rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                  value={adminCredentials.admin_password}
                  onChange={handleSignInChange}
                  required
                />
              </section>
              <h4
                className={`${"text-sm text-center text-red-500"} ${hasError ? "" : "hidden"}`}
              >
                Admin credentials not found
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
                  {departments.map((department) => (
                    <option key={department} value={department}>
                       {department}
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
                <input
                  type="password"
                  id="password"
                  className={`${"w-2/3 rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                  name="officeHead_password"
                  value={officeHeadCredentials.officeHead_password}
                  onChange={handleOHSignInChange}
                  required
                />
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

      <footer className="w-full bg-red-900 flex justify-between p-2">
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
      </footer>
    </div>
  );
};

export default AdminLogins;
