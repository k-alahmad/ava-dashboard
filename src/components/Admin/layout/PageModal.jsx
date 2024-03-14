import React, { useRef, useEffect } from "react";
import { Close } from "@mui/icons-material";

const PageModal = ({
  children,
  isOpen,
  title,
  onSaveClick,
  onCancelClick,
  newItem,
  editable,
  disabled,
  alertMessage,
  modalWidth,
  drawerH,
}) => {
  // const ref = useRef(null);
  // const handleClickOutside = (event) => {
  //   if (ref.current && !ref.current.contains(event.target)) {
  //     onCancelClick();
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // }, []);
  return (
    <>
      <div
        className={`${
          isOpen ? "scale-100" : "scale-0"
        } transition-all duration-500 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none z-50`}
      >
        <div
          className={`relative my-6 mx-auto w-full ${
            modalWidth ?? "max-w-[50vw]"
          } `}
          // ref={ref}
        >
          {/*content*/}
          <div
            className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none`}
          >
            {/*header*/}
            <header className="flex items-center justify-between p-4 border-b border-solid border-slate-200 rounded-t relative overflow-hidden bg-secondary shadow-lg">
              <div className="h-[500px] w-1/2 rounded-full bg-primary/50 blur-[120px] absolute -top-[250px] -right-[10%]" />
              <div className=" font-bold w-full flex justify-between items-center place-self-center">
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
              className={`flex-1 w-full py-4 ${
                drawerH ?? "min-h-[65vh] max-h-[65vh]"
              } transition-all duration-500 overflow-auto`}
            >
              {children}
            </div>

            {/*footer*/}
            <div className="flex items-center justify-between border-t border-solid border-slate-200 rounded-b h-14 p-4">
              <div onClick={onCancelClick} className="cursor-pointer">
                Cancel
              </div>
              <button
                onClick={onSaveClick}
                className={`cursor-pointer ${
                  disabled ? "text-gray-600" : "text-primary"
                }`}
              >
                {editable && (newItem ? "Save" : "Save Changes")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageModal;
