import React from "react";

interface PageDotsProps {
  totalDots: number;
  completedDots: number;
}

const PageDots: React.FC<PageDotsProps> = ({ totalDots, completedDots }) => {
  return (
    <div className="flex space-x-2">
      {Array.from({ length: totalDots }).map((_, index) => {
        const isCompleted = index < completedDots;
        return (
          <div
            key={index}
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isCompleted ? "bg-black" : "bg-gray-400"
            }`}
          >
            {isCompleted && (
              <svg
                className="w-3 h-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PageDots;
