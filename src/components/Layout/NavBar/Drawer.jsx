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
        " fixed overflow-hidden z-50 bg-transparent bg-opacity-0 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 -translate-x-0"
          : " transition-all delay-500 opacity-0 -translate-x-full")
      }
    >
      <section
        className={
          "bg-secondary w-screen max-w-full sm:max-w-[60%] lg:max-w-[35%] xl:max-w-[28%] 2xl:max-w-[25%] left-0 absolute h-full shadow-2xl duration-500 transition-all transform" +
          (isOpen ? " -translate-x-0" : " -translate-x-full")
        }
      >
        <article className="relative w-screen max-w-full pb-10 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden h-full ">
          <header className="w-[90%] p-1 rounded-xl font-bold flex items-center justify-between fixed top-[1%] md:top-[3%] left-[5%] shadow-xl drop-shadow-xl z-10">
            <img
              src={!isLoading ? API_BASE_URL + "/" + img : ""}
              alt={!isLoading ? userName : "Profile"}
              className="!w-20 !h-20  md:!w-28 md:!h-28 rounded-xl bg-secondary"
            />
            <p className="font-bold text-tiny md:text-smaller lg:text-small text-primary text-center px-1">
              {!isLoading && userName}
            </p>
            <MdClose
              className="text-primary !text-[30px] mx-2"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </header>
          <div className="h-[500px] w-[500px] rounded-full bg-primary/50 blur-[120px] absolute -top-[30%] -left-[40%]" />
          <div className="h-[180px] md:min-h-[180px] !w-full" />
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
