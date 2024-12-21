import React, { useState } from "react";
import ReactModal from "react-modal"; // Assuming you're using react-modal package

const EditStudentModal = ({ student, isOpen, onClose, onSave }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(editedStudent); // Save the edited student data
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative z-20 w-full max-w-lg mx-auto my-6 bg-white p-6 rounded-lg shadow-lg max-h-screen overflow-y-auto"
      overlayClassName="fixed inset-0 z-10 bg-black bg-opacity-50"
    >
      <div className="p-4">
        <h2 className="text-xl font-bold">Edit Student</h2>

        <form>
          <div className="mb-4">
            <label className="block">Student ID</label>
            <input
              type="text"
              name="username"
              value={editedStudent.username}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              value={editedStudent.name}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block">Course</label>
            <select
              name="program"
              value={editedStudent.program}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            >
              <option value="">Select Course</option>
              <option value="BSIT">BSIT</option>
              <option value="BSIS">BSIS</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Year</label>
            <select
              name="year"
              value={editedStudent.year}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Block</label>
            <select
              name="block"
              value={editedStudent.block}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            >
              <option value="">Select Block</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={editedStudent.email}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block">Password</label>
            <input
              type="text"
              name="password"
              value={editedStudent.password}
              onChange={handleChange}
              className="border px-4 py-2 w-full"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default EditStudentModal;
