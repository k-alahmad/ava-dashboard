import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.svg";
import Drawer from "./Drawer";
import LinkElement from "./LinkElement";
import { Dehaze as MdDehaze } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { data } from "../../../data/navData";
import NavMenu from "./NavMenu";
import { useGetProfileQuery } from "../../../redux/auth/authApiSlice";
const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [pathName, setPathName] = useState("");
  const {
    data: User,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useGetProfileQuery();
  useEffect(() => {
    let foundPN = data.find((x) => x.link == location.pathname);
    let PN = location.pathname == "/profile" ? "Profile" : foundPN?.name;
    setPathName(PN);
  }, [location.pathname]);
  return (
    <>
      <div
        className={`flex justify-between items-center font-medium bg-primary px-4 text-third z-50 fixed w-full shadow-lg`}
      >
        <div className="flex items-center justify-center">
          <div className="m-1 pt-2 bg-secondary/80 backdrop-blur-[200px] rounded-md">
            <img
              src={Logo}
              alt="LOGO"
              className=" w-[100px] h-[60px] scale-110"
            />
          </div>
          <div
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer mx-8"
          >
            <MdDehaze fontSize="large" />
          </div>
        </div>
        <p className="text-med font-bold">{pathName ?? "Not Found"}</p>
        <NavMenu
          img={User?.Image?.URL}
          userName={User?.Name}
          isLoading={isLoading || isFetching || !isSuccess}
        />
      </div>
      <div className="h-24" />
      <Drawer
        isOpen={mobileOpen}
        setIsOpen={setMobileOpen}
        userName={User?.Name}
        img={User?.Image?.URL}
        isLoading={isLoading || isFetching || !isSuccess}
      >
        {data.map((e) => (
          <LinkElement
            key={e.link}
            name={e.name}
            link={e.link}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </Drawer>
    </>
  );
};

export default NavBar;
