import React, { ChangeEvent, useState } from 'react';
import SurveyContents from './SurveyContents'; // Import SurveyContents component

const SurveyForm: React.FC = () => {
  const [content, setContent] = useState('Instruction');

  const handleNextClick = () => {
    if (content === 'Instruction') {
      setContent('Select Offices');
    } else if (content === 'Select Offices') {
      setContent('Survey Contents');
    }
  };

  const handleBackClick = () => {
    setContent('Instruction');
  };

  const [selectedOffice, setSelectedOffice] = useState([]);

  function handleCheckboxChange(_event: ChangeEvent<HTMLInputElement>): void {
    const { checked, name } = _event.target;
    if(checked){
      setSelectedOffice([...selectedOffice, name]);
    }else{
      setSelectedOffice(selectedOffice.filter((office) => office !== name));
    }
  }

  return (
    <div className='m-4 md:m-10 lg:m-20'>
      {content === 'Instruction' ? (
        <>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4">{content}</h1>
          <p className='bg-gray-100 rounded-lg border p-4 text-sm md:text-base lg:text-lg'>
            We value your feedback! Please share your experience with School Student Services by rating us on a scale of 5 (Very Satisfied) to 1 (Very Dissatisfied). Your honest feedback will help us improve our services to better meet your needs.
          </p>

          <div className='flex items-center mt-4'>
            <label className="text-sm md:text-base lg:text-lg">5</label>
            <div className='w-4 h-4 bg-green-800 ml-2'></div>
            <span className='ml-2 text-sm md:text-base lg:text-lg'>Very Satisfied</span>
          </div>

          <div className='flex items-center mt-4'>
            <label className="text-sm md:text-base lg:text-lg">4</label>
            <div className='w-4 h-4 bg-green-500 ml-2'></div>
            <span className='ml-2 text-sm md:text-base lg:text-lg'>Satisfied</span>
          </div>

          <div className='flex items-center mt-4'>
            <label className="text-sm md:text-base lg:text-lg">3</label>
            <div className='w-4 h-4 bg-yellow-300 ml-2'></div>
            <span className='ml-2 text-sm md:text-base lg:text-lg'>Neutral</span>
          </div>

          <div className='flex items-center mt-4'>
            <label className="text-sm md:text-base lg:text-lg">2</label>
            <div className='w-4 h-4 bg-red-400 ml-2'></div>
            <span className='ml-2 text-sm md:text-base lg:text-lg'>Dissatisfied</span>
          </div>

          <div className='flex items-center mt-4'>
            <label className="text-sm md:text-base lg:text-lg">1</label>
            <div className='w-4 h-4 bg-red-700 ml-2'></div>
            <span className='ml-2 text-sm md:text-base lg:text-lg'>Very Dissatisfied</span>
          </div>

          <div className='flex justify-end mt-10'>
            <button
              className='px-4 py-2  text-black rounded-lg text-sm md:text-base lg:text-lg'
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </>
      ) : (
<>
  {content === 'Select Offices' && (
  <>
  <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center">{content}</h1>
  <div className="flex flex-col space-y-2 m-2">
    {/* List of offices */}
    {['Admission Office', 'Registrar Office', 'Guidance Office', 'Health Service Office', 'Library', 'Canteen (Food Service)', 'Student Publication', 'Scholarship Programs', 'Student Organization Sport and Cultural Services'].map((office, index) => (
      <label key={index} className="flex items-center justify-between">
        <span className='font-bold '>{office}</span>  
        <input
          type="checkbox" 
          name={office} 
          value={office}
          onChange={handleCheckboxChange} 
          className="ml-2"
        />
      </label>
    ))}
  </div>
  <div className="flex justify-between mt-10"> {/* Changed to justify-between */}
    <button
      className="px-4 py-2  text-black rounded-lg text-sm md:text-base lg:text-lg mr-4" // Add margin for spacing
      onClick={handleBackClick}
    >
      Back
    </button>
    <button
      className="px-4 py-2  text-black rounded-lg text-sm md:text-base lg:text-lg"
      onClick={handleNextClick}
    >
      Next
    </button>
  </div>
</>

 
  )}

   {/* Survey Contents section */}
   {content === 'Survey Contents' && (
            <SurveyContents selectedOffice={selectedOffice}/>
          )}
</>


      )}
    </div>
  );
};

export default SurveyForm;
