import React from "react";
import { Close as MdClose } from "@mui/icons-material";
import Logo from "../../../assets/logo/logo.svg";
export default function Drawer({ children, isOpen, setIsOpen }) {
  return (
    <main
      className={
        " fixed overflow-hidden z-50 bg-gray-900  bg-opacity-0 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 -translate-x-0"
          : " transition-all delay-500 opacity-0 -translate-x-full")
      }
    >
      <section
        className={
          "w-screen max-w-[20%] left-0 absolute bg-secondary/80 backdrop-blur-[200px] h-full shadow-2xl duration-500 transition-all transform" +
          (isOpen ? " -translate-x-0" : " -translate-x-full")
        }
      >
        <article className="relative w-screen max-w-sm pb-10 flex flex-col justify-start items-center space-y-6 overflow-y-auto h-full">
          <header className="p-4 font-bold w-full flex items-center justify-between">
            <img
              className="h-[80px] sm:h-[80px] cursor-pointer"
              src={Logo}
              alt="LOGO"
            />
            <MdClose
              size={30}
              className="text-primary"
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </header>
          <div className="pb-10 flex flex-col justify-start items-start space-y-6">
            {children}
          </div>
        </article>
      </section>
      <section
        className={`w-screen h-full cursor-pointer `}
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
