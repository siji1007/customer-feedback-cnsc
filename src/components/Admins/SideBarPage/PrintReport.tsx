import React, { useState } from 'react';
import { FaPrint } from 'react-icons/fa'; // Assuming you're using react-icons for the print icon

const PrintReport: React.FC = () => {
    const [content, setContent] = useState<string>('Print Overall Result'); // Initialize with 'Print Overall' for initial display
    const [selectedDepartment, setSelectedDepartment] = useState<string>(''); // State for selected department
    const [startDate, setStartDate] = useState<string>(''); // State for start date
    const [endDate, setEndDate] = useState<string>(''); // State for end date

    // Function to handle button clicks and change content accordingly
    const handleButtonClick = (type: string) => {
        if (type === 'overall') {
            setContent('Print Overall Result');
        } else if (type === 'specific') {
            setContent('Print Specific Department');
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Print Report</h1>
            <label className="bg-red-800 w-full h-8 block rounded-lg"></label>
            <div className="flex gap-8">
                <div className="flex flex-col gap-4 w-1/4">
                    <button onClick={() => handleButtonClick('overall')} className="text-black font-bold py-2 px-4 rounded text-left ">
                        Print Overall
                    </button>
                    <button onClick={() => handleButtonClick('specific')} className="text-black font-bold py-2 px-4 rounded text-left ">
                        Print Specific Department
                    </button>
                </div>
                <div className="flex flex-col w-3/4">
                    <div className="bg-gray-200 p-4 rounded items-center flex flex-col justify-center rounded-lg shadow-maroon m-5">
                        <h2 className="text-xl mb-4">{content}</h2>
                        {content === 'Print Specific Department' && (
                            <>
                                <div className="mb-4 w-full">
                                    <label htmlFor="department" className="block text-left mb-2">Select Department</label>
                                    <select
                                        id="department"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full p-2 rounded border"
                                    >
                                        <option value="">-- Select Department --</option>
                                        <option value="ICS">ICS</option>
                                        <option value="CBPA">CBPA</option>
                                        <option value="COENG">COENG</option>
                                        <option value="ARTS and SCIENCES">ARTS and SCIENCES</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>
                                <div className="flex gap-4 mb-4 w-full">
                                    <div className="flex-1">
                                        <label htmlFor="startDate" className="block text-left mb-2">Start Year</label>
                                        <input
                                            type="number"
                                            id="startDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            placeholder="2020"
                                            className="w-full p-2 rounded border"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="endDate" className="block text-left mb-2">End Year</label>
                                        <input
                                            type="number"
                                            id="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            placeholder="2021"
                                            className="w-full p-2 rounded border"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <button className="bg-red-800 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                            <FaPrint className="inline-block mr-2" size={20} /> Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintReport;
