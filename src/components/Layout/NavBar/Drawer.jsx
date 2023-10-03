import React from "react";
import { Close as MdClose } from "@mui/icons-material";
import { API_BASE_URL } from "../../../constants";
export default function Drawer({
  children,
  isOpen,
  setIsOpen,
  isLoading,
  userName,
  img,
}) {
  return (
    <main
      className={
        " fixed overflow-hidden z-50 bg-secondary/10 bg-opacity-0 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 -translate-x-0"
          : " transition-all delay-500 opacity-0 -translate-x-full")
      }
    >
      <section
        className={
          "backdrop-blur-[10px] bg-secondary/30 w-screen max-w-[20%] left-0 absolute h-full shadow-2xl duration-500 transition-all transform" +
          (isOpen ? " -translate-x-0" : " -translate-x-full")
        }
      >
        <article className="backdrop-blur-[10px] bg-secondary/80 relative w-screen max-w-full pb-10 flex flex-col justify-start items-center overflow-y-auto h-full">
          <header className="w-[95%] p-1 rounded-xl font-bold flex items-center justify-between fixed top-[1%] left-[2.5%] bg-secondary shadow-2xl drop-shadow-2xl z-10">
            <img
              src={!isLoading ? API_BASE_URL + "/" + img : ""}
              alt={!isLoading ? userName : "Profile"}
              className="!w-28 !h-28 rounded-xl bg-primary"
            />
            <p className="font-bold text-smaller text-white text-center px-1">
              {!isLoading && userName}
            </p>
            <MdClose
              className="text-primary !text-[30px] mx-2"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </header>
          <div className="min-h-[180px] !w-full" />
          <div className="h-full flex flex-col justify-start items-start space-y-6 w-[80%]">
            {children}
          </div>
        </article>
      </section>
      <section
        className={`w-screen h-full cursor-pointer`}
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
