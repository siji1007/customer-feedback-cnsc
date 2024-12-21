import React, { useState, useEffect } from "react";
import host from '../../../hostingport.txt?raw';
import EditStudentModal from './userManagement/EditStudentModal';
import CreateAccountModal from "./userManagement/CreateAccount";
import { TiUserAddOutline } from "react-icons/ti";
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("Students");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  


  useEffect(() => {
    // Fetch filtered students data from the backend API when searchTerm changes
    const fetchFilteredStudents = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const response = await fetch(host + `/fetchStudents?search=${searchTerm}`);
        const data = await response.json();
        setStudents(data); // Set the filtered student data in state
      } catch (error) {
        console.error("Error fetching filtered students:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching is complete
      }
    };
  
    fetchFilteredStudents();
  }, [searchTerm]); // Add searchTerm as a dependency
  
  

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const saveEditedStudent = (editedStudent) => {
    // Send edited student data to the backend
    console.log('Saving student data:', editedStudent);
    // You can make a PUT or PATCH request to update the student in the database

    // After saving, close the modal and update the local students state
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.username === editedStudent.username ? editedStudent : student
      )
    );
    closeModal();
  };

    // Filter students based on the search term
    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };
    
      const closeCreateModal = () => {
        setIsCreateModalOpen(false);
      };



      const handleDelete = async (username) => {
        try {
          const response = await fetch(host+"/delete_user", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          });
          const data = await response.json();
          if (response.ok) {
            alert(data.message); // Show success message
            // After successful deletion, filter out the deleted student from the state
            setStudents((prevStudents) =>
              prevStudents.filter((student) => student.username !== username)
            );
          } else {
            alert(data.error); // Show error message if the deletion failed
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Error deleting user");
        }
      };

      
  const renderContent = () => {
    switch (activeTab) {
      case "Students":
        return (
            <div className="p-4">
            <div className="flex justify-between">
                <span className="text-lg font-semibold">Students: {filteredStudents.length}</span>
                <input
                type="text"
                placeholder="Search by User ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border rounded"
                />
            </div>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="overflow-y-auto max-h-64">
                  <table className="min-w-full mt-4 table-auto">
                    <thead className="sticky top-0 bg-gray-200 z-10">
                      <tr>
                        <th className="px-4 py-2">No.</th>
                        <th className="px-4 py-2">User ID </th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Program</th>
                        <th className="px-4 py-2">Year</th>
                        <th className="px-4 py-2">Block</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr key={student["username"]}>
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{student["username"]}</td>
                            <td className="px-4 py-2">{student["name"]}</td>
                            <td className="px-4 py-2">{student["program"]}</td>
                            <td className="px-4 py-2">{student["year"]}</td>
                            <td className="px-4 py-2">{student["block"]}</td>
                            <td className="px-4 py-2">{student["email"]}</td>
                            <td className="px-4 py-2">
                              <div className="flex space-x-2 md:space-x-4">
                                <button
                                  className="px-4 py-2 bg-blue-900 text-white rounded-lg"
                                  onClick={() => openEditModal(student)}
                                >
                                  Edit
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-800 text-white rounded-lg"
                                    onClick={() => handleDelete(student.username)} // Call handleDelete with the student's username
                                    >
                                    Delete
                                    </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            No students found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
          
          
      case "Employee":
        return <div className="p-4">Employee accounts</div>;
      case "Other":
        return <div className="p-4">Other accounts</div>;
      default:
        return <div className="p-4">Select a tab to view content</div>;
    }
  };

  return (
    <div className="p-2 w-full">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex items-center justify-between mb-4 rounded-lg p-2 bg-red-800">
        <div className="flex">
          {/* Students Button */}
          <button
            className={`px-4 py-2 rounded-lg sm:w-40 md:w-32 lg:w-28 mr-1 ${
              activeTab === "Students"
                ? "border-b-4 border-white text-white font-bold text-center"
                : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
            }`}
            onClick={() => setActiveTab("Students")}
          >
            Students
          </button>

          {/* Employee Button */}
          <button
            className={`px-4 py-2 rounded-lg sm:w-40 md:w-32 lg:w-28 mr-1 ${
              activeTab === "Employee"
                ? "border-b-4 border-white text-white font-bold text-center"
                : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
            }`}
            onClick={() => setActiveTab("Employee")}
          >
            Employee
          </button>

          {/* Other Button */}
          <button
            className={`px-4 py-2 rounded-lg sm:w-40 md:w-32 lg:w-28 ${
              activeTab === "Other"
                ? "border-b-4 border-white text-white font-bold text-center"
                : "bg-transparent text-white text-center hover:border-b-4 border-white hover:text-white"
            }`}
            onClick={() => setActiveTab("Other")}
          >
            Other
          </button>
        </div>

        <button
          className="px-4 py-2 hover:bg-white hover:text-red-900 rounded-lg bg-red-800 text-white flex"
          onClick={openCreateModal}
        >
        <TiUserAddOutline className="hover:bg-white hover:text-red-900 rounded-lg bg-red-800 text-white text-center"/>
          Create Account
          
        </button>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg shadow-lg bg-white">
        {renderContent()}
      </div>

      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={saveEditedStudent}
        />
      )}

        <CreateAccountModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </div>
  );
};

export default UserManagement;
