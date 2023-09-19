import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.svg";
import Drawer from "./Drawer";
import LinkElement from "./LinkElement";
import { Dehaze as MdDehaze } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { data } from "../../../data/navData";
const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [pathName, setPathName] = useState("");
  useEffect(() => {
    let foundPN = data.find((x) => x.link == location.pathname);
    let PN = foundPN?.name;
    setPathName(PN);
  }, [location.pathname]);
  return (
    <>
      <div
        className={`flex justify-between items-center font-medium bg-primary px-4 text-third z-50 fixed w-full shadow-lg`}
      >
        <div onClick={() => setMobileOpen(true)} className="px-8">
          <MdDehaze fontSize="large" />
        </div>

        <p className="text-med font-bold">{pathName ?? "Not Found"}</p>
        <div className="flex justify-center items-center bg-secondary/80 backdrop-blur-[200px] rounded-lg m-1 px-1 ">
          <img className=" h-[70px] cursor-pointer " src={Logo} alt="LOGO" />
        </div>
      </div>
      <div className="h-24" />
      <Drawer isOpen={mobileOpen} setIsOpen={setMobileOpen}>
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
