import React from "react";
import { createPortal } from "react-dom";

export const Modal = ({
  children,
  error,
  description,
  title,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div
          className={`bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center fixed inset-0 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onMouseDown={onClose}
        >
          <div
            className="bg-[#434343] py-[2vh] px-[2vw] w-[90vw] sm:w[40vw] md:w-[30vw] gap-[0.5vh] rounded-lg shadow-lg flex flex-col"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#7e7e7e] text-[2vh] select-none font-actor">
                {title}
              </div>
              <div
                className="cursor-pointer text-[2vh] text-[#949494] hover:text-white select-none"
                onClick={onClose}
              >
                ✖
              </div>
            </div>
            <div className="text-md text-[#afafaf] text-[1.5vh] select-none font-actor">
              {description}
            </div>
            <div className="text-red-400 text-[1.4vh]">{error && error}</div>
            <div className="text-white">{children}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
