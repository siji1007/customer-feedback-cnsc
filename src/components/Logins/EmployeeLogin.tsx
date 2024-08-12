import React, { useState, useEffect } from "react";
import axios from "axios";

interface SignInData {
  account_id: string;
  employee_pass: string;
}

interface SignUpData {
  account_id: string;
  employee_dept: string;
  employee_pass: string;
  employee_cpass: string;
}

interface EmployeeLoginProps {
  onLoginSuccess: () => void;
}

const EmployeeLogin: React.FC<EmployeeLoginProps> = ({ onLoginSuccess }) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signInData, setSignInData] = useState<SignInData>({
    account_id: "",
    employee_pass: "",
  });
  const [signUpData, setSignUpData] = useState<SignUpData>({
    account_id: "",
    employee_dept: "",
    employee_pass: "",
    employee_cpass: "",
  });
  const [departments, setDepartments] = useState<string[]>([]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginClick = () => {
    setShowLoginForm(true); // Show only login form fields
    setShowSignUpForm(false); // Hide signup form
  };

  const handleBackClick = () => {
    window.location.href = "/customer";
  };

  const handleSignUpClick = () => {
    setShowLoginForm(false); // Hide login form
    setShowSignUpForm(true); // Show signup form again
  };

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [event.target.name]: event.target.value });
  };

  const handleSignUpChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setSignUpData({ ...signUpData, [event.target.name]: event.target.value });
  };

  const handleEmployeeSignIn = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_SERVERHOST + "employee-login",
        signInData,
      );
      setHasError(false);
      globalThis.activeId = signInData["account_id"];
      onLoginSuccess();
    } catch (error) {
      setHasError(true);
    }
  };

  const handleEmployeeSignUp = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.REACT_APP_SERVERHOST + "add-employee",
        signUpData,
      );
      onLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          import.meta.env.REACT_APP_SERVERHOST + "service_department",
        );
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4">
        {showLoginForm ? "Login" : "Sign-Up"}
      </h2>
      {showSignUpForm && (
        <form onSubmit={handleEmployeeSignUp}>
          <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="employeeId"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                className="w-2/3 rounded-full border"
                name="account_id"
                value={signUpData.account_id}
                onChange={handleSignUpChange}
                required
              />
            </section>
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="department"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Department
              </label>
              <select
                id="department"
                className="w-2/3 rounded-full border bg-white"
                value={signUpData.employee_dept}
                name="employee_dept"
                onChange={handleSignUpChange}
                required
              >
                <option value="">Select Department</option>
                {departments.length > 0 &&
                  departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
              </select>
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
                  id="password"
                  className="w-full rounded-lg border pr-10"
                  name="employee_pass"
                  value={signUpData.employee_pass}
                  onChange={handleSignUpChange}
                  required
                />

                <button
                  className="absolute inset-y-0 right-0 px-3 py-1 text-sm font-medium text-gray-600"
                  type="button"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </section>
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="confirmPassword"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-2/3 rounded-full border"
                name="employee_cpass"
                value={signUpData.employee_cpass}
                onChange={handleSignUpChange}
                required
              />
            </section>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg w-full"
          >
            Sign-up
          </button>
        </form>
      )}
      {showLoginForm && (
        <form onSubmit={handleEmployeeSignIn}>
          <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="employeeId"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Employee ID
              </label>
              <input
                type="text"
                id="employeeId"
                className={`w-2/3 rounded-lg border ${hasError ? "border-red-500" : ""}`}
                name="account_id"
                onChange={handleLoginChange}
                value={signInData.account_id}
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
                  id="password"
                  className={`${"w-full rounded-lg border pr-10"} ${hasError ? "border-red-500" : ""}`}
                  name="employee_pass"
                  onChange={handleLoginChange}
                  value={signInData.employee_pass}
                  required
                />

                <button
                  className="absolute inset-y-0 right-0 px-3 py-1 text-sm font-medium text-gray-600"
                  type="button"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </section>
            <h4
              className={`text-sm text-center text-red-500 ${hasError ? "" : "hidden"}`}
            >
              User credential not found
            </h4>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-lg w-full"
          >
            Login
          </button>
          <button
            type="button"
            className="mt-4 px-4 py-2 text-black w-full bg-gray-200 rounded-lg"
            onClick={handleBackClick}
          >
            Back
          </button>
        </form>
      )}
      {!showLoginForm && (
        <>
          <label>___________or__________</label>
          <button onClick={handleLoginClick}>Already a customer? Login</button>
        </>
      )}
      {showLoginForm && (
        <>
          <label>___________or__________</label>
          <button onClick={handleSignUpClick}>Create an account? Signup</button>
        </>
      )}
    </div>
  );
};

export default EmployeeLogin;
