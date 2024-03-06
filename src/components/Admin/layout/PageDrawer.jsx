import React from "react";
import { Close as MdClose } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectSideNavStatus } from "../../../redux/sideBar.slice";
export default function PageDrawer({
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
}) {
  const sideNavOpen = useSelector(selectSideNavStatus);
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
          "w-screen max-w-full right-0 absolute bg-white h-full delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen
            ? sideNavOpen
              ? " md:translate-x-[300px] 2xl:translate-x-[400px] "
              : "md:translate-x-[100px] "
            : " translate-x-full ")
        }
      >
        <article
          className={`relative w-screen ${
            sideNavOpen
              ? "w-screen  md:w-[calc(100%-300px)] 2xl:w-[calc(100%-400px)]"
              : "max-w-full md:max-w-[calc(100%-100px)]"
          } pb-10 flex flex-col justify-start items-center space-y-6 overflow-y-scroll h-full`}
        >
          <header
            className={`${
              sideNavOpen
                ? "w-full md:w-[calc(100%-300px)] 2xl:w-[calc(100%-400px)]"
                : "w-full md:w-[calc(100%-100px)]"
            } px-[3%] h-16 fixed z-20 bg-secondary overflow-hidden flex justify-center items-center left-0`}
          >
            <div className="relative w-full">
              <div className="h-[500px] w-1/2 rounded-full bg-primary/50 blur-[120px]  absolute -top-[250px] -right-[10%]" />
              <div className=" font-bold w-full flex justify-between items-center place-self-center">
                <p className="font-regular text-med text-primary">{title}</p>
                <MdClose
                  fontSize="large"
                  className="cursor-pointer text-primary z-20"
                  onClick={onCancelClick}
                />
              </div>
            </div>
          </header>

          <div className="flex-1 w-full px-[3%] py-20">{children}</div>
          <footer
            className={`text-tiny font-regular fixed left-0 bottom-0 bg-white ${
              sideNavOpen
                ? "w-full md:w-[calc(100%-300px)] 2xl:w-[calc(100%-400px)]"
                : "w-full md:w-[calc(100%-100px)]"
            } drop-shadow-2xl px-[3%] z-20 h-14 `}
          >
            <div className="flex justify-evenly items-center py-4">
              <div onClick={onCancelClick} className="cursor-pointer">
                Cancel
              </div>
              <button
                onClick={onSaveClick}
                className={`cursor-pointer ${
                  disabled ? "text-gray-600" : "text-primary"
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
          </footer>
        </article>
      </section>
      {isOpen && (
        <section
          className=" w-screen h-full cursor-pointer bg-black/0"
          onClick={onCancelClick}
        ></section>
      )}
    </main>
  );
}
