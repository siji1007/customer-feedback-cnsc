import React, { useState } from "react";
import { FaRegQuestionCircle, FaUndo } from "react-icons/fa";
import axios from "axios";

const Archive: React.FC = () => {
  const serverUrl = import.meta.env.VITE_APP_SERVERHOST;
  //const [questionnaires, setQuestionnaires] = useState<string[]>([]);
  const [archivedQuestionnaires, setArchivedQuestionnaires] = useState<
    string[]
  >([]);
  const [aqIds, setAqIds] = useState<string[]>([]);

  const [selectedOffice, setSelectedOffice] = useState<string>(null);

  const handleRestoreQuestionnaire = async (index: number) => {
    try {
      const response = await axios.post(serverUrl + "recoverArchive", {
        selectedId: aqIds[index],
      });
      handleQuestionnaire(selectedOffice);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestionnaire = async (office) => {
    try {
      setSelectedOffice(office);
      const response = await axios.post(serverUrl + "getArchive", {
        office: office,
      });
      setArchivedQuestionnaires(response.data.aname);
      setAqIds(response.data.aid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[70vh] bg-[#c3c3c3] rounded-lg p-4 ml-2 relative">
      <select
        value={selectedOffice}
        onChange={(e) => handleQuestionnaire(e.target.value)}
        className="absolute right-0 top-0 mt-2 p-1 text-sm border border-gray-300 m-4 w-24"
      >
        <option value="OSSD">OSSD</option>
        <option value="Registrar">Registrar</option>
        <option value="Admission">Admission</option>
      </select>

      <div className="relative mb-4">
        <h2
          className="font-bold text-center text-black border-b-2 border-white"
          style={{ color: "maroon" }}
        >
          Archived Questionnaires
        </h2>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-black rounded-lg p-2 overflow-auto"
        style={{ height: "calc(100% - 40px)" }}
      >
        {archivedQuestionnaires.length > 0 ? (
          archivedQuestionnaires.map((questionnaire, index) => (
            <div
              key={`${selectedOffice}-${index}`}
              className="flex flex-col items-center justify-between p-4 border border-white rounded-lg hover:bg-gray-100"
              style={{
                cursor: "pointer",
                height: archivedQuestionnaires.length === 1 ? "auto" : "auto",
                minWidth: "150px", // Ensure cards are not too small
                maxWidth: "300px", // Limit the maximum width
              }}
            >
              <FaRegQuestionCircle size={48} className="text-red-800 mb-2" />
              <span className="font-bold text-center">{questionnaire}</span>
              <button
                className="bg-green-600 text-white py-1 px-4 rounded-lg mt-2 flex items-center justify-center"
                onClick={() => handleRestoreQuestionnaire(index)}
              >
                <FaUndo className="mr-2" />
                Restore
              </button>
            </div>
          ))
        ) : (
          <div className="p-2 text-gray-600 col-span-full text-center">
            No archived questionnaires found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;
