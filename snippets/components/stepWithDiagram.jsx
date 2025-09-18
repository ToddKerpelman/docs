import React from "react";

export const StepWithDiagram = ({ step, asset, hideBorder, children }) => {
  return (
    <div
      className={`flex items-start max-w-5xl mb-4 flex-col md:flex-row           
        ${!hideBorder ? "border-t border-gray-300" : ""}
        ${step === 1 && !hideBorder ? "border-gray-300" : ""}`}
    >
      <div className={`pr-8 pt-4 flex`}>
        {step && <span className="mr-4 font-bold text-lg">{step}</span>}
        <div className="flex-1 text-md">{children}</div>
      </div>
      <div className="w-60 pl-0 md:pl-4 flex-shrink-0 mt-16 md:mt-0">
        <img
          className="w-full h-auto"
          src={asset}
          alt={`Step ${step == null ? "" : step} diagram`}
        />
      </div>
    </div>
  );
};
