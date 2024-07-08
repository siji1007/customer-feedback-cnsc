import React, { useState, useEffect } from 'react';
import axios from "axios";

interface SignInData {
  employee_id: string;
  employee_pass: string;
}

const EmployeeLogin: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(true);
  const [signInData, setSignInData] = useState<SignInData>({employee_id: '', employee_pass: ''});
  // Initial state for showing signup form

  const handleLoginClick = () => {
    setShowLoginForm(true);  // Show only login form fields
    setShowSignUpForm(false); // Hide signup form
  };

  const handleBackClick = () => {
    setShowLoginForm(false); // Hide login form
    setShowSignUpForm(true); // Show signup form again
  };

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInData({ ...signInData, [event.target.name]: event.target.value });
  };

  const handleEmployeeSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const response = await axios.post('http://localhost:8082/employee-login', signInData);
      alert(response.data);
    }catch(error){
      console.error(error);
      //Lagyan mo dito ng pupula yung entry or something pag mali yung password
    }
  };

  const handleSignInClick = () => {
    alert("LOGIN CLICKED!");
  };
  

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4'>
        {showLoginForm ? 'Login' : 'Sign-Up'}
      </h2>
      {showSignUpForm && (
        <form>
          <div className='bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md'>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="employeeId" className='w-1/3 text-sm sm:text-base md:text-lg'>Employee ID</label>
              <input type="text" id="employeeId" className='w-2/3 rounded-full border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="department" className='w-1/3 text-sm sm:text-base md:text-lg'>Department</label>
              <input type="text" id="department" className='w-2/3 rounded-full border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='w-1/3 text-sm sm:text-base md:text-lg'>Password</label>
              <input type="password" id="password" className='w-2/3 rounded-full border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="confirmPassword" className='w-1/3 text-sm sm:text-base md:text-lg'>Confirm Password</label>
              <input type="password" id="confirmPassword" className='w-2/3 rounded-full border' required />
            </section>
          </div>
          <button type="submit" className='mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full'>Sign-up</button>
        </form>
      )}
      {showLoginForm && (
        <form onSubmit={handleEmployeeSignIn}>
          <div className='bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md'>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="employeeId" className='w-1/3 text-sm sm:text-base md:text-lg'>Employee ID</label>
              <input type="text" id="employeeId" className='w-2/3 rounded-full border' name="employee_id" onChange={handleLoginChange} value={signInData.employee_id} required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='w-1/3 text-sm sm:text-base md:text-lg'>Password</label>
              <input type="password" id="password" className='w-2/3 rounded-full border' name="employee_pass" onChange={handleLoginChange} value={signInData.employee_pass} required />
            </section>
          </div>
          <button type="submit" className='mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full'>Login</button>
          <button type="button" className='mt-4 px-4 py-2 text-black w-full' onClick={handleBackClick}>Back</button>
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

export default EmployeeLogin;
