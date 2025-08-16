import React from "react";
import "./loading.css"

const Loading = ({ smallHeight }) => {
  return (
    <div
      className={`${
        smallHeight ? "h-[250px]" : "h-[100vh]"
      } flex flex-col justify-center items-center`}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
