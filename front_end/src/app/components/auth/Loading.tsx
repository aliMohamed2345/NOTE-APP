import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary">
      <div className="w-16 h-16 border-8 border-t-8 border-gray-300 border-t-purple rounded-full animate-spin" />
    </div>
  );
};

export default Loading;
