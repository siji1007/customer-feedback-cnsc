import React from 'react';

const EmployeeLogin: React.FC = () => {
  return (
    <div className='flex flex-col items-center'>
  
      <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4'>Sign-up</h2>
      <div className='bg-gray-200 border-stone-400 border rounded-lg shadow-md p-4 w-full max-w-md'>
        <section className='flex justify-between items-center mb-4'>
          <label className='w-1/3 text-sm sm:text-base md:text-lg'>Employee ID</label>
          <input type="text" className='w-2/3  rounded-full border'/>
        </section>
        <section className='flex justify-between items-center mb-4'>
          <label className='w-1/3 text-sm sm:text-base md:text-lg'>Department</label>
          <input type="text" className='w-2/3  rounded-full border'/>
        </section>
        <section className='flex justify-between items-center mb-4'>
          <label className='w-1/3 text-sm sm:text-base md:text-lg'>Password</label>
          <input type="password" className='w-2/3  rounded-full border'/>
        </section>
        <section className='flex justify-between items-center mb-4'>
          <label className='w-1/3 text-sm sm:text-base md:text-lg'>Confirm Password</label>
          <input type="password" className='w-2/3  rounded-full border'/>
        </section>
      </div>
      <button className='mt-4 px-4 py-2 bg-red-900 text-white rounded-full w-full'>Sign-up</button>
      <label >___________or__________</label>
      <button>Already a customer? Login</button>
    </div>
  );
};

export default EmployeeLogin;
