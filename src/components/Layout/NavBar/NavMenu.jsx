import React, { useState, useRef, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { Logout, Person } from "@mui/icons-material";
import { API_BASE_URL } from "../../../constants";
import { Style } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import { useLazyLogoutQuery } from "../../../redux/auth/authApiSlice";
const NavMenu = ({ img, userName, isLoading }) => {
  // const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading: logoutloading, isSuccess: logoutSuccess }] =
    useLazyLogoutQuery();
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
          className={`flex justify-center items-center m-1 gap-x-2 p-2 cursor-pointer ${
            isLoading && "animate-pulse"
          }`}
        >
          <div
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="p-0 m-0 relative text-center font-bold text-smaller cursor-pointer"
          >
            <img
              src={!isLoading ? API_BASE_URL + img : ""}
              alt={!isLoading ? userName : "User Image"}
              className="w-10 h-10 rounded-full bg-primary"
            />
          </div>
          <p className="max-md:hidden font-bold text-tiny md:text-small text-third">
            {!isLoading && userName}
          </p>
          <ExpandMore fontSize="large" />
        </div>

        <div
          ref={ref}
          onClick={() => setOpen(false)}
          className={`${
            open ? "scale-100" : "scale-0"
          } overflow-hidden absolute z-10 origin-top-right right-[2%] top-16 bg-secondary rounded-lg shadow-2xl transition-all duration-300 p-4 space-y-2 text-third font-regular text-tiny md:text-smaller min-w-40`}
        >
          <div className="h-full w-full rounded-full bg-primary/50 blur-[120px] absolute -top-1/2 -left-1/2" />

          <div
            className="md:hidden flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <p className="font-bold text-tiny">{!isLoading && userName}</p>
          </div>
          <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <Person className="text-primary" />
            <p>View Profile</p>
          </div>
          {/* <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              navigate("/personalization");
            }}
          >
            <Style className="text-primary" />
            <p>Personalization</p>
          </div> */}
          <div
            className="flex justify-start items-center cursor-pointer gap-x-2"
            onClick={() => {
              logout().then(() => {
                dispatch(logOut());
              });
            }}
          >
            <Logout className="text-primary" />
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
