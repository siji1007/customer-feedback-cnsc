import React, { useState } from 'react';
import { FaRegQuestionCircle, FaUndo } from 'react-icons/fa';

const Archive: React.FC = () => {
    const [questionnaires, setQuestionnaires] = useState<{ [key: string]: { name: string }[] }>({
        HR: [{ name: 'Questionnaire 1' }, { name: 'Questionnaire 2' }],
        Engineering: [{ name: 'Questionnaire A' }, { name: 'Questionnaire B' }],
        Chemin: [{ name: 'Questionnaire X' }, { name: 'Questionnaire Y' }]
    });
    const [deletedQuestionnaires, setDeletedQuestionnaires] = useState<{ [key: string]: { name: string }[] }>({
        HR: Array(100).fill(null).map((_, index) => ({ name: `Deleted Questionnaire ${index + 1}` })),
        Engineering: [{ name: 'Deleted Questionnaire A' }],
        Chemin: [{ name: 'Deleted Questionnaire X' }]
    });

    const [selectedOffice, setSelectedOffice] = useState<string>('HR');

    const handleRestoreQuestionnaire = (officeName: string, index: number) => {
        setDeletedQuestionnaires(prev => {
            const updatedDeleted = { ...prev };
            const restoredQuestionnaire = updatedDeleted[officeName].splice(index, 1)[0];
            
            setQuestionnaires(prev => {
                const updated = { ...prev };
                if (updated[officeName]) {
                    updated[officeName].push(restoredQuestionnaire);
                } else {
                    updated[officeName] = [restoredQuestionnaire];
                }
                return updated;
            });

            return updatedDeleted;
        });
    };

    return (
        <div className="w-full h-[70vh] bg-[#c3c3c3] rounded-lg p-4 ml-2 relative">
                <select
                    value={selectedOffice}
                    onChange={(e) => setSelectedOffice(e.target.value)}
                   className="absolute right-0 top-0 mt-2 p-1 text-sm border border-gray-300 m-4 w-24"
                >
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Chemin">Chemin</option>
                </select>

            <div className="relative mb-4">
                <h2 className="font-bold text-center text-black border-b-2 border-white" style={{ color: "maroon" }}>
                    Archived Questionnaires
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-black rounded-lg p-2 overflow-auto" style={{ height: "calc(100% - 40px)" }}>
                {deletedQuestionnaires[selectedOffice] && deletedQuestionnaires[selectedOffice].length > 0 ? (
                    deletedQuestionnaires[selectedOffice].map((questionnaire, index) => (
                        <div key={`${selectedOffice}-${index}`} className="flex flex-col items-center justify-between p-4 border border-white rounded-lg hover:bg-gray-100"
                            style={{
                                cursor: "pointer",
                                height: deletedQuestionnaires[selectedOffice].length === 1 ? "auto" : "auto",
                                minWidth: "150px", // Ensure cards are not too small
                                maxWidth: "300px" // Limit the maximum width
                            }}
                        >
                            <FaRegQuestionCircle size={48} className="text-red-800 mb-2" />
                            <span className='font-bold text-center'>{questionnaire.name}</span>
                            <button className="bg-green-600 text-white py-1 px-4 rounded-lg mt-2 flex items-center justify-center" onClick={() => handleRestoreQuestionnaire(selectedOffice, index)}>
                                <FaUndo className="mr-2" />
                                Restore
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-2 text-gray-600 col-span-full text-center">No archived questionnaires found.</div>
                )}
            </div>
        </div>
    );
};

export default Archive;
