import React from "react";

const ContentWrapper = ({ children }) => {
  return (
    <div className="min-w-32 h-full p-5 m-2 flex flex-col rounded-md shadow-lg gap-5 bg-white overflow-auto border border-gray-200">
      {children}
    </div>
  );
};

export default ContentWrapper;
