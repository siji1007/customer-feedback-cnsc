// src/components/ErrorPage.tsx
import React from 'react';

const ErrorPage: React.FC = () => {
    return (
        <div
            className="h-screen w-screen bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/src/assets/background_error.png')" }}
        >
            {/* Content here if needed */}
        </div>
    );
};

export default ErrorPage;
