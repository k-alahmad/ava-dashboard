import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.svg";
import Drawer from "./Drawer";
import LinkElement from "./LinkElement";
import {
  Dehaze as MdDehaze,
  Close as MdClose,
  // ExpandMore,
  // ExpandLess,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { data } from "../../../data/navData";
import NavMenu from "./NavMenu";
import { useGetProfileQuery } from "../../../redux/auth/authApiSlice";
// import { Collapse } from "@mui/material";

const NavBar = ({ isOpen, setIsOpen, expand, setExpand }) => {
  // const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [pathName, setPathName] = useState("");
  // const [expand, setExpand] = useState({ status: false, key: 0 });
  const {
    data: User,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useGetProfileQuery();
  useEffect(() => {
    let foundPN = data.find((x) =>
      x.link
        ? x.link == location.pathname
        : x.childs.find((xx) => xx.link == location.pathname)
    );
    let PN;
    if (location.pathname == "/profile") PN = "Profile";
    else if (location.pathname == "/personalization") PN = "Personalization";
    else if (foundPN?.link) {
      PN = foundPN.name;
    } else {
      PN =
        foundPN?.name +
        " / " +
        foundPN?.childs.find((x) => x.link == location.pathname).name;
    }
    setPathName(PN);
  }, [location.pathname]);
  return (
    <>
      <div
        className={`font-regular bg-secondary text-third z-50  fixed w-full shadow-lg`}
      >
        <div
          className={`flex justify-between items-center relative overflow-hidden`}
        >
          <div className="h-[500px] w-1/2 rounded-full bg-primary/50 blur-[120px]  absolute top-0 -right-0" />

          <div className="flex items-center justify-center">
            <div className="m-1 p-2 max-md:hidden">
              <img
                src={Logo}
                alt="LOGO"
                className="w-14 h-10 scale-150 translate-y-1"
              />
            </div>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer md:mx-8"
            >
              {isOpen ? (
                <MdClose
                  className="text-primary !text-[30px] mx-2"
                  onClick={() => {
                    setIsOpen(false);
                    setExpand({ ...expand, status: false });
                  }}
                />
              ) : (
                <MdDehaze fontSize="large" className="text-primary" />
              )}
            </div>
          </div>
          <p className="text-smaller sm:text-small lg:text-med drop-shadow-2xl text-center font-bold">
            {pathName ?? "Not Found"}
          </p>
          <NavMenu
            img={User?.Image?.URL}
            userName={User?.Name}
            isLoading={isLoading || isFetching}
          />
        </div>
      </div>
      <div className="h-24" />
      {/* <Drawer
        isOpen={mobileOpen}
        setIsOpen={setMobileOpen}
        userName={User?.Name}
        img={User?.Image?.URL}
        isLoading={isLoading || isFetching || !isSuccess}
      >
        {data.map((e, i) =>
          e.link ? (
            <LinkElement
              icon={e.icon}
              key={e.link}
              name={e.name}
              link={e.link}
              onClick={() => setMobileOpen(false)}
            />
          ) : (
            <div className="w-full" key={i}>
              <div
                onClick={() =>
                  setExpand({
                    status: expand.key == i ? !expand.status : true,
                    key: i,
                  })
                }
                className={`${
                  expand.key == i && expand.status
                    ? "text-primary"
                    : "text-white"
                } font-semibold text-tiny md:text-smaller 2xl:text-small flex justify-between items-center`}
              >
                <div className="flex items-center">
                  {e.icon && (
                    <img
                      className="object-contain w-10 h-10"
                      src={e.icon}
                      alt={e.name}
                    />
                  )}
                  <p className="px-1 cursor-pointer">{e.name}</p>
                </div>
                {expand.status && expand.key == i ? (
                  <ExpandLess fontSize="large" />
                ) : (
                  <ExpandMore fontSize="large" />
                )}
              </div>
              <Collapse
                in={expand.status && expand.key == i}
                timeout="auto"
                unmountOnExit
                className="mt-4"
              >
                {e.childs.map((item, index) => {
                  return (
                    <LinkElement
                      icon={item.icon}
                      key={index}
                      name={item.name}
                      link={item.link}
                      onClick={() => setMobileOpen(false)}
                      styled={"px-5 py-2"}
                    />
                  );
                })}
              </Collapse>
            </div>
          )
        )}
      </Drawer> */}
    </>
  );
};

export default NavBar;
