import React, { useEffect, useState } from 'react';
import { FaChartLine, FaArchive } from 'react-icons/fa';
import axios from "axios";
import hosting from "../../hostingport.txt?raw";

interface Office {
    id: number;
    name: string;
  }  

const ClientDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<'offices' | 'responses'>('offices');
    const [allOffices, setAllOffices] = useState<Office[]>([]);
    const serverlURL = hosting.trim();
    const scaleCategories = [
        'Needs Improvement', 'Failed to Meet Expectations', 
        'Meet Expectations', 'Exceeds Expectations', 'Outstanding'
    ];

    const fetchOffices = async() => {
        try{
            const response = await axios.get(serverlURL + "/office");
            setAllOffices(response.data.offices);
        }catch(error){
            console.error(error);
        }
    }

    useEffect(() => {
        fetchOffices();
    }, []);

    const handleMainMenuClick = () => {
        // Use window.location.href for a full page reload
        window.location.href = '/customer';
    };

    const handleViewChange = (view: 'offices' | 'responses') => {
        setActiveView(view);
    };

    return (
        <div className="flex flex-col w-full h-[80vh] max-w-screen">

           

            <div className="flex bg-red-800 text-white p-4 w-full">
                <button 
                    onClick={() => handleViewChange('offices')} 
                    className={`flex-1 h-12 flex items-center justify-center text-center ${activeView === 'offices' ? 'bg-white text-black rounded-lg mr-10' : 'hover:bg-white-100'}`}
                >
                    <FaChartLine className="mr-2 inline" />
                    Offices
                </button>
                <button 
                    onClick={() => handleViewChange('responses')} 
                    className={`flex-1 h-12 flex items-center justify-center text-center ${activeView === 'responses' ? 'bg-white text-black rounded-lg ml-10' : 'hover:bg-whit-100'}`}
                >
                    <FaArchive className="mr-2 inline ml-2" />
                    Review Responses
                </button>
            </div>


            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto h-[calc(100vh-4rem)] w-full">

                {/* Content based on active view */}
                {activeView === 'offices' ? (
                    <>
                        <h1 className="text-xl font-bold mb-4 text-center">Office List</h1>
                        <div className="border-2 border-gray-300 rounded-lg p-4 h-[calc(50vh-8rem)] overflow-y-auto"> 
                            {/* Adjust height to account for header and footer */}
                            <ul className="list-none">
                                {allOffices.map((office, index) => (
                                    <li 
                                        key={index} 
                                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                                    >
                                        <span>{office.name}</span>
                                        <input type="checkbox" readOnly className="ml-auto" />
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
