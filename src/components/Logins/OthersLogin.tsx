import React, { useState } from "react";
import axios from "axios";

interface ClientInformation {
  client_name: string;
  client_addr: string;
  client_type: string;
}

interface OthersLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void; // Add a prop for back navigation
}

const OtherLogin: React.FC<OthersLoginProps> = ({ onLoginSuccess }) => {
  const [clientData, setClientData] = useState<ClientInformation>({
    client_name: "",
    client_addr: "",
    client_type: "",
  });

  const handleOtherChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setClientData({ ...clientData, [event.target.name]: event.target.value });
  };

  const handleClientLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Store "external" in localStorage
      //localStorage.setItem("ShowSurvey", "external"); // store the survey form to show
      //onLoginSuccess();   //State that login success and show now the external content survey

      // Send client data to the server
      const response = await axios.post(
        import.meta.env.VITE_APP_SERVERHOST + "client-login", 
        clientData
      );
      localStorage.setItem("client_type", clientData.client_type)
      onLoginSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackClick = () => {
    window.location.href = '/customer';
  };

  return (
    <div className="flex flex-col items-center w-full p-10">
      <h2 className="text-xl mb-4">Personal Information</h2>

      <form
        className="flex flex-col items-center w-full"
        onSubmit={handleClientLogin}
      >
        <section className="bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4">
          <label className="block mb-1">NAME</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            name="client_name"
            value={clientData.client_name}
            onChange={handleOtherChange}
            required
          />
        </section>

        <section className="bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4">
          <label className="block mb-1">ADDRESS</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            name="client_addr"
            value={clientData.client_addr}
            onChange={handleOtherChange}
            required
          />
        </section>

        <section className="bg-gray-200 p-2 rounded-lg w-full max-w-md mb-4">
          <label className="block mb-1">TYPE OF CLIENT</label>
          <select
            className="w-full p-2 border border-gray-300 bg-gray-300 rounded-md"
            name="client_type"
            value={clientData.client_type}
            onChange={handleOtherChange}
          >
            <option value="agency">Agency</option>
            <option value="participant">Participant</option>
            <option value="client_research">Client (Research)</option>
          </select>
        </section>

        <div className="flex justify-between w-full max-w-md">
          <button
            type="button"
            onClick={handleBackClick} // Handle back navigation
            className="flex items-center text-black px-5 py-2 bg-gray-200 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.707 10.293a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L7.414 10l3.707 3.707a1 1 0 0 1-1.414 1.414l-4-4z"
              />
            </svg>
            Back
          </button>

          <button
            type="submit"
            className="flex items-center text-black px-5 py-2 bg-white text-black font-bold rounded-md"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.293 10.293a1 1 0 0 0 0-1.414l-4-4a1 1 0 0 0-1.414 1.414L11.586 10l-3.707 3.707a1 1 0 1 0 1.414 1.414l4-4a1 1 0 0 0 0-1.414z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherLogin;
