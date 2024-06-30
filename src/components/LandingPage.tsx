import React, { useState } from 'react';
import StudentLogin from './Logins/StudentLogin';
import EmployeeLogin from './Logins/EmployeeLogin';
import OtherLogin from './Logins/OthersLogin';

const LandingPage: React.FC = () => {
  const [selectedLogin, setSelectedLogin] = useState<string>('');

  const handleLoginSelection = (loginType: string) => {
    setSelectedLogin(loginType);
  };

  return (
    <div>
      <header>
        <h1>Header</h1>
      </header>
      <main>
        {selectedLogin === '' && (
          <nav>
            <button onClick={() => handleLoginSelection('student')}>Student Login</button>
            <button onClick={() => handleLoginSelection('employee')}>Employee Login</button>
            <button onClick={() => handleLoginSelection('other')}>Other Login</button>
          </nav>
        )}
        {selectedLogin === 'student' && <StudentLogin />}
        {selectedLogin === 'employee' && <EmployeeLogin />}
        {selectedLogin === 'other' && <OtherLogin />}
      </main>
      <footer>
        <h1>Footer</h1>
        {/* Add footer content here */}
      </footer>
    </div>
  );
};

export default LandingPage;
