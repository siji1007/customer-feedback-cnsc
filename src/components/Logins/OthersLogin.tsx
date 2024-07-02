import React from 'react';

const OtherLogin: React.FC = () => {
  return (
    <div className='flex flex-col items-center w-full '>
      <h2 className='text-xl mb-4'>Personal Information</h2>
    
      <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
        <label className='block mb-1'>NAME</label>
        <input type="text" className='w-full p-2 border border-gray-300 rounded-md' required  />
      </section>

      <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
        <label className='block mb-1'>ADDRESS</label>
        <input type="text" className='w-full p-2 border border-gray-300 rounded-md' />
      </section>

      <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
        <label className='block mb-1'>TYPE OF CLIENT</label>
        <select className='w-full p-2 border border-gray-300 rounded-md'>
          <option value='1'>Agency</option>
          <option value='2'>Participant</option>
          <option value='3'>Client (Research)</option>
        </select>
      </section>
      <div className='flex justify-end w-full'>
        <button className='flex items-center text-black px-5 py-2 '>
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.293 10.293a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 1.414L11.586 10l-3.707 3.707a1 1 0 1 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OtherLogin;
