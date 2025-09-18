import React from "react";

export const StepWithDiagram = ({ step, asset, hideBorder, children }) => {
  return (
    <div className="flex items-start max-w-5xl mb-12 flex-col md:flex-row">
      <div
        className={`
          pr-8 pt-4 flex
          ${!hideBorder ? "border-t border-gray-300" : ""}
          ${step === 1 && !hideBorder ? "border-gray-900" : ""}
        `}
      >
        {step && <span className="mr-8 font-bold text-lg">{step}</span>}
        <div className="flex-1">{children}</div>
      </div>
      <div className="w-80 pl-0 md:pl-24 flex-shrink-0 mt-16 md:mt-0">
        <img
          className="w-full h-auto"
          src={asset}
          alt={`Step ${step == null ? "" : step} diagram`}
        />
      </div>
    </div>
  );
};
