import React, { useRef, useEffect } from "react";
import { Close } from "@mui/icons-material";

const PdfModal = ({
  children,
  isOpen,
  title,
  onSaveClick,
  onCancelClick,
  newItem,
  editable,
  disabled,
  pdf,
  pdfLoading,
}) => {
  return (
    <>
      <div
        className={`${
          isOpen ? "scale-100" : "scale-0"
        } transition-all duration-500 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-50`}
      >
        <div className={`relative mx-auto w-full`}>
          {/*content*/}
          <div
            className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`}
          >
            {/*header*/}
            <header className="flex items-center justify-between border-b border-solid border-slate-200 rounded-t relative overflow-hidden bg-secondary shadow-lg h-16">
              <div className="h-[500px] w-1/2 rounded-full bg-primary/50 blur-[120px] absolute -top-[250px] -right-[10%]" />
              <div className=" font-bold w-full flex justify-between items-center place-self-center p-4">
                <p className="font-regular text-med text-primary">{title}</p>
                <Close
                  fontSize="large"
                  className="cursor-pointer text-primary z-30"
                  onClick={onCancelClick}
                />
              </div>
            </header>
            {/*body*/}
            <div
              className={`flex-1 w-full max-h-[calc(100vh-4rem)] transition-all duration-500 overflow-auto`}
            >
              {children}
            </div>

            <button
              onClick={onSaveClick}
              className={`cursor-pointer text-smaller absolute bottom-5 right-10 bg-primary rounded-full shadow-2xl drop-shadow-2xl px-2 py-1 border-2 border-secondary  ${
                disabled ? "text-gray-600" : "text-secondary"
              } ${pdfLoading && "animate-bounce font-bold"}`}
              disabled={pdfLoading}
            >
              {editable
                ? newItem
                  ? "Save"
                  : "Save Changes"
                : pdf && (pdfLoading ? "GENERATING FILE" : "Download PDF")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfModal;
