import React, { useState } from 'react';
import { FaChartLine, FaArchive } from 'react-icons/fa';


const allOffices = [
    'Admission Office', 'Registrar Office', 'Guidance Office', 
    'Health Service Office', 'Library', 'Canteen (Food Service)', 
    'Student Publication', 'Scholarship Programs', 'Student Organization Sport and Cultural Services'
];

const scaleCategories = [
    'Needs Improvement', 'Failed to Meet Expectations', 
    'Meet Expectations', 'Exceeds Expectations', 'Outstanding'
];

const ClientDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<'offices' | 'responses'>('offices');

    const handleMainMenuClick = () => {
        // Use window.location.href for a full page reload
        window.location.href = '/customer';
    };

    const handleViewChange = (view: 'offices' | 'responses') => {
        setActiveView(view);
    };

    return (
        <div className="flex flex-col h-min-screen">
            {/* Header Section */}
            <div className="flex bg-red-800 text-white p-4">
                <button 
                    onClick={() => handleViewChange('offices')} 
                    className={`flex-1 h-12 flex items-center justify-center text-center ${activeView === 'offices' ? 'bg-white text-black rounded-lg' : 'hover:bg-gray-700'}`}
                >
                    <FaChartLine className="mr-2 inline" />
                    Offices
                </button>
                <button 
                    onClick={() => handleViewChange('responses')} 
                    className={`flex-1 h-12 flex items-center justify-center text-center ${activeView === 'responses' ? 'bg-white text-black rounded-lg' : 'hover:bg-gray-700'}`}
                >
                    <FaArchive className="mr-2 inline" />
                    Review Responses
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto">
                {/* Content based on active view */}
                {activeView === 'offices' ? (
                    <>
                        <h1 className="text-xl font-bold mb-4 text-center">Office List</h1>
                        <div className="border-2 border-gray-300 rounded-lg p-4 h-[calc(50vh-8rem)] overflow-y-auto"> {/* Adjust height to account for header and footer */}
                            <ul className="list-none">
                                {allOffices.map((office, index) => (
                                    <li key={index} className="py-2 border-b border-gray-200 last:border-b-0">
                                        {office}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-xl font-bold mb-4">Review Responses</h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {scaleCategories.map((category, index) => (
                                <div key={index} className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white text-white text-center">
            <button 
                    className="bg-red-800 text-white font-bold rounded-lg p-2"
                    onClick={handleMainMenuClick}
                >
                    Main menu
                </button>
            </div>
        </div>
    );
};

export default ClientDashboard;
