import React from "react";
import { Close as MdClose } from "@mui/icons-material";
export default function PageDrawer({
  children,
  isOpen,
  title,
  onSaveClick,
  onCancelClick,
  newItem,
  editable,
  disabled,
}) {
  return (
    <main
      className={
        " fixed overflow-hidden z-50 bg-gray-900 bg-opacity-0 inset-0 transform ease-in-out" +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          "w-screen max-w-full right-0 absolute bg-white h-full shadow-2xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen max-w-full pb-10 flex flex-col justify-start items-center space-y-6 overflow-y-scroll h-full">
          <header className="w-full shadow-xl px-[3%] pt-4 fixed z-20 bg-secondary overflow-hidden">
            <div className="relative">
              <div className="h-[500px] w-1/2 rounded-full bg-primary/50 blur-[120px]  absolute top-0 -right-[10%]" />
              <div className=" font-bold w-full flex justify-between items-center place-self-center">
                <p className="font-regular text-med text-primary">{title}</p>
                <MdClose
                  size={30}
                  className="cursor-pointer text-primary z-20"
                  onClick={onCancelClick}
                />
              </div>
            </div>
            <div className="h-[2px] w-full mt-4" />
          </header>

          <div className="flex-1 w-full px-[3%] py-20">{children}</div>
          <footer className="text-tiny font-regular fixed bottom-0 bg-white w-full drop-shadow-2xl px-[3%] z-20 ">
            <div className="h-[2px] w-full " />
            <div className="flex justify-evenly items-center py-4">
              <div onClick={onCancelClick} className="cursor-pointer">
                Cancel
              </div>
              <button
                onClick={
                  disabled
                    ? () => alert("Required fields are missing!")
                    : onSaveClick
                }
                className={`cursor-pointer ${
                  disabled ? "text-gray-600" : "text-primary"
                }`}
              >
                {editable && (newItem ? "Save" : "Save Changes")}
              </button>
            </div>
          </footer>
        </article>
      </section>
      {isOpen && (
        <section
          className=" w-screen h-full cursor-pointer bg-black/60"
          onClick={onCancelClick}
        ></section>
      )}
    </main>
  );
}
