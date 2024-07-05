const Dashboard: React.FC = () => {
return(
    <div>
        <header className="w-full border-b pb-4 mb-4 flex items-center justify-between bg-red-900 p-2 rounded-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              className="mr-2 h-5 w-5"
              // Add any checkbox-specific logic here
            />
            <label htmlFor="selectAll" className="text-lg text-white font-bold">All</label>
          </div>

          {/* Select box positioned to the right */}
          <div className="ml-auto relative">
            <label htmlFor="officeSelect" className="text-lg text-white font-bold mr-2">Select Office</label>
            <select id="officeSelect" className="bg-white-100 text-black border border-gray-600 rounded-md py-1 px-2">
              <option value="admission">Admission Office</option>
              <option value="guidance">Guidance Office</option>
              <option value="registrar">Registrar Office</option>
            </select>
          </div>

          {/* Semester and Academic Year selection */}
          <div className="ml-10 flex flex-col">
            <div >
              <label htmlFor="semesterSelect" className="text-sm text-white font-bold mr-2">Semester</label>
              <select id="semesterSelect" className="bg-white-100 text-black border border-gray-600  ">
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>
            <div className="mt-2">
              <label htmlFor="academicYearSelect" className="text-sm text-white font-bold mr-2">Academic Year</label>
              <select id="academicYearSelect" className="bg-white-100 text-black border border-gray-600  text-sm ml-5">
                <option value="2023-2024">2023-2024</option>
                {/* Add more options as needed */}
              </select>
            </div>
          </div>
        </header>
    </div>
);
};

export default Dashboard;