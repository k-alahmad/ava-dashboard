import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logo/logo.svg";
import { useLocation } from "react-router-dom";
import { data } from "../../../data/navData";
import NavMenu from "./NavMenu";
import { useGetProfileQuery } from "../../../redux/auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSideNavStatus,
  openSideNav,
  closeSideNav,
} from "../../../redux/sideBar.slice";
const NavBar = () => {
  const location = useLocation();
  const [pathName, setPathName] = useState("");
  const sideNavOpen = useSelector(selectSideNavStatus);
  const dispatch = useDispatch();
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
        className={`font-regular bg-secondary text-third z-50 fixed w-full shadow-lg`}
      >
        <div className={`flex justify-between items-center relative`}>
          <div className="absolute -top-0 -right-0 h-full w-1/2 overflow-hidden">
            <div className="h-[500px] w-full -right-[10%] rounded-full bg-primary/50 blur-[120px] absolute" />
          </div>
          <div className="flex items-center justify-start flex-1">
            <div className="m-1 p-1">
              <img
                src={Logo}
                alt="LOGO"
                className="w-14 h-10 scale-150 translate-y-1"
              />
            </div>
            <div
              onClick={() => {
                dispatch(sideNavOpen == true ? closeSideNav() : openSideNav());
                // setExpand({ ...expand, status: false });
              }}
              className={`cursor-pointer md:ml-4 space-y-2 z-50 ${
                sideNavOpen ? "md:translate-x-52" : "md:translate-x-4"
              } transition-all duration-500`}
            >
              <div
                className={`bg-primary h-0.5 w-10 transition-all duration-700 ${
                  sideNavOpen ? "rotate-45  translate-y-[10px]" : "rotate-0"
                }`}
              />
              <div
                className={`bg-primary h-0.5 w-10 transition-all duration-500 ${
                  sideNavOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <div
                className={`bg-primary h-0.5 w-10 transition-all duration-700 ${
                  sideNavOpen ? "-rotate-45 -translate-y-[10px]" : "rotate-0"
                }`}
              />
            </div>
          </div>
          <p className="text-smaller sm:text-small lg:text-med drop-shadow-2xl text-center font-bold flex-1 whitespace-nowrap">
            {pathName ?? "Not Found"}
          </p>
          <div className="flex-1 w-full flex items-center justify-end">
            <NavMenu
              img={User?.Image?.URL}
              userName={User?.Name}
              isLoading={isLoading || isFetching}
            />
          </div>
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
