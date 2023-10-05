import React, { useState, useRef, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { Logout, Person } from "@mui/icons-material";
import { API_BASE_URL } from "../../../constants";
import { Style } from "@mui/icons-material";
const NavMenu = ({ img, userName, isLoading }) => {
  // const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className="rounded-md">
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className={`flex justify-center items-center m-1 gap-x-2 bg-secondary/80 backdrop-blur-[200px] rounded-xl p-2 cursor-pointer shadow-xl drop-shadow-xl ${
            isLoading && "animate-pulse"
          }`}
        >
          <div
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="p-0 m-0 relative text-black text-center font-bold text-smaller cursor-pointer"
          >
            <img
              src={!isLoading ? API_BASE_URL + "/" + img : ""}
              alt={!isLoading ? userName : "User Image"}
              className="w-10 h-10 rounded-full bg-primary"
            />
          </div>
          <p className="font-bold text-smaller">{!isLoading && userName} </p>
        </div>

        <div
          ref={ref}
          onClick={() => setOpen(false)}
          className={`${
            open ? "scale-100" : "scale-0"
          } absolute z-10 origin-top-right right-0 top-15 bg-secondary/80 backdrop-blur-[200px] rounded-lg shadow-2xl transition-all duration-300 p-4 space-y-2 text-white font-regular text-smaller min-w-40`}
        >
          <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <Person />
            <p>View Profile</p>
          </div>
          <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              navigate("/personalization");
            }}
          >
            <Style />
            <p>Personalization</p>
          </div>
          <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              dispatch(logOut());
            }}
          >
            <Logout />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
