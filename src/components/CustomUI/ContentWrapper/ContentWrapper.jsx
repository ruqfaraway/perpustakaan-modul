import React from "react";

const ContentWrapper = ({ children }) => {
  return (
    <div className="w-full h-full p-5 flex flex-col rounded-md shadow-lg gap-5">
      {children}
    </div>
  );
};

export default ContentWrapper;
