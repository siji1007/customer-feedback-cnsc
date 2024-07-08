import React, { useState } from 'react';
import axios from "axios";

interface ClientInformation {
  client_name: string;
  client_addr: string;
  client_type : string;
}

const OtherLogin: React.FC = () => {
  const [clientData, setClientData] = useState<ClientInformation>({client_name:'', client_addr:'', client_type:''});

  const handleOtherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClientData({ ...clientData, [event.target.name]: event.target.value});
  };

  const handleClientLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{
      const response = await axios.post('http://localhost:8082/client-login', clientData);
      alert(response.data);
    }catch(error){
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col items-center w-full '>
      <h2 className='text-xl mb-4'>Personal Information</h2>
    
      <form className='flex flex-col items-center w-full ' onSubmit={handleClientLogin}>
        <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
          <label className='block mb-1'>NAME</label>
          <input type="text" className='w-full p-2 border border-gray-300 rounded-md' name='client_name' value={clientData.client_name} onChange={handleOtherChange} required  />
        </section>

        <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
          <label className='block mb-1'>ADDRESS</label>
          <input type="text" className='w-full p-2 border border-gray-300 rounded-md' name='client_addr' value={clientData.client_addr} onChange={handleOtherChange}/>
        </section>

        <section className='bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4'>
          <label className='block mb-1'>TYPE OF CLIENT</label>
          <select className='w-full p-2 border border-gray-300 rounded-md' name='client_type' value={clientData.client_type} onChange={handleOtherChange}>
            <option key="agency" value='agency'>Agency</option>
            <option key="participant" value='participant'>Participant</option>
            <option key="client_research" value='client_research'>Client (Research)</option>
          </select>
        </section>
        <div className='flex justify-end w-full'>
          <button type="submit" className='flex items-center text-black px-5 py-2 '>
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.293 10.293a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 1.414L11.586 10l-3.707 3.707a1 1 0 1 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherLogin;
