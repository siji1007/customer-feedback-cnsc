import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Department'); // State to track active tab

    const renderContent = () => {
        switch (activeTab) {
            case 'Department':
                return <div className="mt-4">Department Content</div>;
            case 'Questions':
                return <div className="mt-4">Questions Content</div>;
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
                <button className={`px-4 py-2 rounded-lg text-white ${activeTab === 'Department' ? 'bg-white text-black font-bold' : ' hover:bg-white hover:text-red-800'}`} onClick={() => setActiveTab('Department')}>
                    Department
                </button>
                <button className={`px-4 py-2 rounded-lg text-white ml-2 ${activeTab === 'Questions' ? 'bg-white text-red-900 font-bold' : 'hover:bg-white hover:text-red-800'}`} onClick={() => setActiveTab('Questions')}>
                    Questions
                </button>
                <button className={`px-4 py-2 rounded-lg text-white ml-2 ${activeTab === 'Notification' ? 'bg-white text-red-900 font-bold' : 'hover:bg-white hover:text-red-800'}`} onClick={() => setActiveTab('Notification')}>
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
