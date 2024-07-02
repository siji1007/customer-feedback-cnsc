import React, { useState } from 'react';

const StudentLogin: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(true); // Initial state for showing signup form

  const handleLoginClick = () => {
    setShowLoginForm(true);  // Show only login form fields
    setShowSignUpForm(false); // Hide signup form
  };

  const handleBackClick = () => {
    setShowLoginForm(false); // Hide login form
    setShowSignUpForm(true); // Show signup form again
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
              <label htmlFor="studentId" className='w-1/3 text-sm sm:text-base md:text-lg'>Student ID</label>
              <input type="text" id="studentId" className='w-2/3 rounded-lg border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="department" className='w-1/3 text-sm sm:text-base md:text-lg'>Department</label>
              <input type="text" id="department" className='w-2/3 rounded-lg border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='w-1/3 text-sm sm:text-base md:text-lg'>Password</label>
              <input type="password" id="password" className='w-2/3 rounded-lg border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="confirmPassword" className='w-1/3 text-sm sm:text-base md:text-lg'>Confirm Password</label>
              <input type="password" id="confirmPassword" className='w-2/3 rounded-lg border' required />
            </section>
          </div>
          <button type="submit" className='mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full'>Sign-up</button>
        </form>
      )}
      {showLoginForm && (
        <form>
          <div className='bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md'>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="studentId" className='w-1/3 text-sm sm:text-base md:text-lg'>Student ID</label>
              <input type="text" id="studentId" className='w-2/3 rounded-lg border' required />
            </section>
            <section className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='w-1/3 text-sm sm:text-base md:text-lg'>Password</label>
              <input type="password" id="password" className='w-2/3 rounded-lg border' required />
            </section>
          </div>
          <button type="submit" className='mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full' onClick={handleSignInClick}>Login</button>
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

export default StudentLogin;
