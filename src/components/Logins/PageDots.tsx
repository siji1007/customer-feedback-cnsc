import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface PageDotsProps {
  totalDots: number;
  completedDots: number;
}

const PageDots: React.FC<PageDotsProps> = ({ totalDots, completedDots }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {Array.from({ length: totalDots }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="relative">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                index < completedDots ? "bg-red-800" : "bg-gray-300"
              }`}
            >
              {index < completedDots && (
                <CheckIcon className="w-3 h-3 text-white" />
              )}
            </div>
            {/* Add the connector line */}
            {index < totalDots - 1 && (
              <div
                className={`absolute left-full top-1/2 transform -translate-y-1/2 w-8 h-1 ${
                  index < completedDots - 1 ? "bg-red-800" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PageDots;
