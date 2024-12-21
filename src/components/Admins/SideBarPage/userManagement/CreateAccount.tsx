import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import host from '../../../../hostingport.txt?raw';
import axios from "axios";

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({ isOpen, onClose }) => {
  console.log("Modal isOpen:", isOpen);

  if (!isOpen) return null;
  const [departments, setDepartments] = useState<string[]>([]); 
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    services: "", // Office Head specific
    colleges: "", // Research Coordinator and Employee specific
    department: "", // Employee specific
  });

  const userTypeFields: Record<string, string[]> = {
    vpre: ["username", "password", "email"],
    services: ["username", "password", "email", "services"],
    researchcoordinator: ["username", "password", "email", "colleges"],
    employee: ["username", "password", "email", "department", "colleges"],  // Added colleges for employee
  };

  const servicesOptions = ["Service A", "Service B", "Service C"];
  const collegesOptions = ["College of Arts", "College of Sciences", "College of Engineering"];

  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserType(e.target.value);
    setFormData({
      username: "",
      password: "",
      email: "",
      services: "",
      colleges: "",
      department: "",
    });
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get<{ offices: { id: string; name: string }[] }>(host + "/office");
      setServices(response.data.offices); // Set the offices list
    } catch (error) {
      console.error("Error fetching offices: ", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (selectedUserType === "services") {
        fetchServices(); // Fetch offices when "officehead" is selected
      }
    }
  }, [isOpen, selectedUserType]);


  const fetchDepartments = async () => {
    try {
      const response = await fetch(host + '/department');
      const result = await response.json();
      if (result.departments) {
        setDepartments(result.departments);  // Update state with department data
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Prepare the data based on selected user type
    const accountData = {
      user_type: selectedUserType,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      services: formData.services || "",  // Services for 'officehead' user type
      colleges: formData.colleges || "",  // Colleges for 'researchcoordinator' and 'employee' user types
      department: formData.department || "",  // Department for 'employee' user type
    };
  
    // Log the data to the console for debugging
    console.log("Account Data:", accountData);
  
    // Show an alert with the data the user input
    alert(
      `Account created successfully!\n\n` +
      `User Type: ${accountData.user_type}\n` +
      `Username: ${accountData.username}\n` +
      `Email: ${accountData.email}\n` +
      (accountData.services ? `Services: ${accountData.services}\n` : "") +
      (accountData.colleges ? `Colleges: ${accountData.colleges}\n` : "") +
      (accountData.department ? `Department: ${accountData.department}\n` : "")
    );
  
    // Call the API to save the data to the database
    try {
      await axios.post(host + "/create-user", accountData);
      alert("Account created and saved successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account, please try again.");
    }
  };
  
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} className="relative z-20 w-full max-w-lg mx-auto my-6 bg-white p-6 rounded-lg shadow-lg max-h-screen overflow-y-auto" overlayClassName="fixed inset-0 z-10 bg-black bg-opacity-50" >
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700" > &times; </button>
        <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select User Type</label>
        <select value={selectedUserType} onChange={handleUserTypeChange} className="border px-4 py-2 w-full" > <option value="" disabled> Select user type </option> <option value="vpre">VPRE</option> <option value="services">Services</option> <option value="researchcoordinator">Research Coordinator</option> <option value="employee">Employee</option> </select>
      </div>


      {selectedUserType && (
        <form>
          {userTypeFields[selectedUserType].includes("username") && (
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="border px-4 py-2 w-full"
              />
            </div>
          )}

          {userTypeFields[selectedUserType].includes("password") && (
            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="border px-4 py-2 w-full"
              />
            </div>
          )}

          {userTypeFields[selectedUserType].includes("email") && (
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border px-4 py-2 w-full"
              />
            </div>
          )}

            {userTypeFields[selectedUserType].includes("services") && (
                        <div className="mb-4">
                        <label className="block mb-2">Services</label>
                        <select
                            name="services"
                            value={formData.services}
                            onChange={handleInputChange}
                            className="border px-4 py-2 w-full"
                        >
                            <option value="" disabled>Select a service</option>
                            {services.length > 0 ? (
                            services.map((office) => (
                                <option key={office.id} value={office.name}>
                                {office.name}
                                </option>
                            ))
                            ) : (
                            <option value="">No services available</option>
                            )}
                        </select>
                        </div>
                    )}

                    {userTypeFields[selectedUserType].includes("colleges") && (
                        <div className="mb-4">
                        <label className="block mb-2">Colleges</label>
                        <select
                            name="colleges"
                            value={formData.colleges}
                            onChange={handleInputChange}
                            className="border px-4 py-2 w-full"
                        >
                            <option value="" disabled>
                            Select a college
                            </option>
                            {departments.length > 0 ? (
                            departments.map((department) => (
                                <option key={department} value={department}>
                                {department}
                                </option>
                            ))
                            ) : (
                            <option value="">No colleges available</option>
                            )}
                        </select>
                        </div>
                    )}

                {selectedUserType !== "employee" && userTypeFields[selectedUserType].includes("department") && (
                <div className="mb-4">
                    <label className="block mb-2">Department</label>
                    <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="border px-4 py-2 w-full"
                    />
                </div>
                )}


          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-800 text-white rounded-lg"
            >
              Create Account
            </button>
          </div>
        </form>
      )}
    </ReactModal>
  );
};

export default CreateAccountModal;
