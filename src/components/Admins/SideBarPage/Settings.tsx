import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Department');
    const offices = [
        'Admission Office', 'Registrar Office', 'Office 3', 'Office 4', 'Office 5', 
        'Office 6', 'Office 7', 'Office 8', 'Office 9', 'Office 10'
    ] as const;
    type Office = typeof offices[number];
    
    const questionsData: Record<Office, string[]> = {
        'Admission Office': ['Q1 for Office 1 ', 'Q2 for Office 1', 'Q3 for Office 1', 'Q4 for Office 1', 'Q5 for Office 1'],
        'Registrar Office': ['Q1 for Office 2', 'Q2 for Office 2', 'Q3 for Office 2', 'Q4 for Office 2', 'Q5 for Office 2'],
        'Office 3': ['Q1 for Office 3', 'Q2 for Office 3', 'Q3 for Office 3', 'Q4 for Office 3', 'Q5 for Office 3'],
        'Office 4': ['Q1 for Office 4', 'Q2 for Office 4', 'Q3 for Office 4', 'Q4 for Office 4', 'Q5 for Office 4'],
        'Office 5': ['Q1 for Office 5', 'Q2 for Office 5', 'Q3 for Office 5', 'Q4 for Office 5', 'Q5 for Office 5'],
        'Office 6': ['Q1 for Office 6', 'Q2 for Office 6', 'Q3 for Office 6', 'Q4 for Office 6', 'Q5 for Office 6'],
        'Office 7': ['Q1 for Office 7', 'Q2 for Office 7', 'Q3 for Office 7', 'Q4 for Office 7', 'Q5 for Office 7'],
        'Office 8': ['Q1 for Office 8', 'Q2 for Office 8', 'Q3 for Office 8', 'Q4 for Office 8', 'Q5 for Office 8'],
        'Office 9': ['Q1 for Office 9', 'Q2 for Office 9', 'Q3 for Office 9', 'Q4 for Office 9', 'Q5 for Office 9'],
        'Office 10': ['Q1 for Office 10', 'Q2 for Office 10', 'Q3 for Office 10', 'Q4 for Office 10', 'Q5 for Office 10'],
    };
    const [selectedOffice, setSelectedOffice] = useState<Office>('Admission Office');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editQuestion, setEditQuestion] = useState<string>("");

    const handleEditClick = (index: number, question: string) => {
        setEditIndex(index);
        setEditQuestion(question);
    };

    const handleSaveClick = () => {
        if (editIndex !== null) {
            const updatedQuestions = [...questionsData[selectedOffice]];
            updatedQuestions[editIndex] = editQuestion;
            //update mo here yung backend pang update nung qestions 
            console.log('Updated Questions:', updatedQuestions);
            // setQuestionsData(prev => ({ ...prev, [selectedOffice]: updatedQuestions }));
            setEditIndex(null); // Exit edit mode
        }
    };

    const handleCancelClick = () => {
        setEditIndex(null); // Exit edit mode without saving
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Department':
                return <div className="mt-4">Department Content</div>;
            case 'Questions':
                return (
                    <div className="flex flex-col md:flex-row h-full overflow-hidden">
                        {/* Sidebar */}
                        <div className="md:w-1/4 w-full border-b md:border-b-0 md:border-r rounded-lg" style={{ height: '35vh', background: '#c3c3c3' }}>
                            <h2 className="font-bold mb-4 text-center b-border text-black border-b-2 border-white" style={{ color: 'maroon' }}>Select Office to Edit Questions</h2>
                            <ul className="space-y-2 overflow-y-auto text-black rounded-lg p-2" style={{ maxHeight: 'calc(100% - 1rem)', background: '#c3c3c3' }}>
                                {offices.map((office, index) => (
                                    <li 
                                        key={index}
                                        className={`cursor-pointer p-2 border border-white rounded-lg ${selectedOffice === office ? 'bg-red-800 text-white' : 'hover:bg-gray-100'}`}
                                        onClick={() => setSelectedOffice(office)}
                                    >
                                        {office}
                                    </li>
                                ))}
                            </ul>
                        </div>
            
                        {/* Questions Section */}
                        <div className="md:w-3/4 w-full p-4 overflow-y-auto shadow-lg" style={{ height: '35vh' }}>
                            <h2 className="font-bold mb-4 text-xl">{selectedOffice}</h2>
                            <ul className="space-y-2 overflow-y-auto ">
                                {questionsData[selectedOffice].map((question, index) => (
                                    <li
                                        key={index}
                                        className="bg-gray-300 text-black p-4 rounded-md shadow-md mb-2 relative "
                                        style={{ backgroundColor: '#c3c3c3' }} // Gray background color
                                    >
                                        {editIndex === index ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={editQuestion}
                                                    onChange={(e) => setEditQuestion(e.target.value)}
                                                    className="w-full mb-2 p-2 rounded-md border border-gray-400"
                                                />
                                                <button
                                                    onClick={handleSaveClick}
                                                    className=" text-white px-4 py-2 rounded-md mr-2"
                                                    style={{background:'#006400'}}
                                                >
                                                    <FaSave /> Save
                                                </button>
                                                <button
                                                    onClick={handleCancelClick}
                                                    className="bg-red-800 text-white px-4 py-2 rounded-md"
                                                >
                                                    <FaTimes /> Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                {question}
                                                <button
                                                    onClick={() => handleEditClick(index, question)}
                                                    className="absolute top-2 right-2  hover:text-blue-800" style={{color:'maroon'}}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'Notification':
                return <div className="mt-4">Notification Content</div>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="flex items-center mb-4 rounded-lg p-2 bg-red-800">
                <button   className={`px-4 py-2 rounded-lg ${activeTab === 'Department' ? 'bg-white text-black font-bold' : 'bg-transparent text-white hover:bg-white hover:text-red-800'}`}  onClick={() => setActiveTab('Department')}>
                    Department
                </button>
                <button   className={`px-4 py-2 rounded-lg ${activeTab === 'Questions' ? 'bg-white text-black font-bold' : 'bg-transparent text-white hover:bg-white hover:text-red-800'}`}  onClick={() => setActiveTab('Questions')}>
                    Questions
                </button>
                <button   className={`px-4 py-2 rounded-lg ${activeTab === 'Notification' ? 'bg-white text-black font-bold' : 'bg-transparent text-white hover:bg-white hover:text-red-800'}`}  onClick={() => setActiveTab('Notification')}>
                    Notification
                </button>
            </div>
            
            {/* Render content based on active tab */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;
