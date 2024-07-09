import React, { useState } from 'react';
import { FaPrint } from 'react-icons/fa'; // Assuming you're using react-icons for the print icon

const PrintReport: React.FC = () => {
    const [content, setContent] = useState<string>('Print Overall Result'); // Initialize with 'Print Overall' for initial display

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
         <label className="bg-red-800 w-full h-8 block rounded-lg">  </label>
            <div className="flex flex-col gap-4">
                <button onClick={() => handleButtonClick('overall')} className="text-black font-bold py-2 px-4 rounded text-left">
                    Print Overall
                </button>
                <button onClick={() => handleButtonClick('specific')} className=" text-black font-bold py-2 px-4 rounded text-left">
                    Print Specific Department
                </button>
            </div>
            <div className="flex justify-center mt-8">
                <div className="bg-gray-200 p-4 rounded items-center flex flex-col justify-center rounded-lg shadow-maroon">
                    <h2 className="text-xl mb-4">{content}</h2>
                    <button className="bg-red-800 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                        <FaPrint className="inline-block mr-2" size={20} /> Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintReport;
