import React, { useState, useEffect } from "react";
import axios from "axios";

interface FormData {
  student_id: string;
  password: string;
}

interface StudentLoginProps {
  onLoginSuccess: () => void;
}

interface SignUpData {
  student_id: string;
  student_dept: string;
  student_pass: string;
  student_cpass: string;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLoginSuccess }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    password: "",
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    student_id: "",
    student_dept: "",
    student_pass: "",
    student_cpass: "",
  });
  const [hasError, setHasError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSignUpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpData({ ...signUpData, [event.target.name]: event.target.value });
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };

  const handleBackClick = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
  };

  const handleStudentSignIn = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_SERVERHOST + "student-login",
        formData,
      );
      setHasError(false);
      onLoginSuccess();
    } catch (error) {
      setHasError(true);
    }
  };

  const handleStudentSignUp = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_APP_SERVERHOST + "add-student",
        signUpData,
      );
      //setShowLoginForm(true);
      onLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_APP_SERVERHOST + "academic_department",
        );
        setDepartments(response.data.departments);
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
        <form onSubmit={handleStudentSignUp}>
          <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="studentId"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Student ID
              </label>
              <input
                type="text"
                name="student_id"
                id="studentId"
                className="w-2/3 rounded-lg border"
                value={signUpData.student_id}
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
                type="text"
                name="student_dept"
                id="department"
                className="w-2/3 rounded-lg border bg-white"
                value={signUpData.student_dept}
                onChange={handleSignUpChange}
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
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Password
              </label>
              <input
                type="password"
                name="student_pass"
                id="password"
                className="w-2/3 rounded-lg border"
                value={signUpData.student_pass}
                onChange={handleSignUpChange}
                required
              />
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
                name="student_cpass"
                id="confirmPassword"
                className="w-2/3 rounded-lg border"
                value={signUpData.student_cpass}
                onChange={handleSignUpChange}
                required
              />
            </section>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full"
          >
            Sign-up
          </button>
        </form>
      )}
      {showLoginForm && (
        <form onSubmit={handleStudentSignIn}>
          <div className="bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md">
            <section className="flex justify-between items-center mb-4">
              <label
                htmlFor="studentId"
                className="w-1/3 text-sm sm:text-base md:text-lg"
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                className={`${"w-2/3 rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
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
                id="password"
                className={`${"w-2/3 rounded-lg border"} ${hasError ? "border-red-500" : ""}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </section>
            <h4
              className={`${"text-sm text-center text-red-500"} ${hasError ? "" : "hidden"}`}
            >
              User credentials not found
            </h4>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full"
          >
            Login
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
      {!showLoginForm && (
        <>
          <label>___________or__________</label>
          <button onClick={handleLoginClick}>Already a customer? Login</button>
        </>
      )}
    </div>
  );
};

export default StudentLogin;
