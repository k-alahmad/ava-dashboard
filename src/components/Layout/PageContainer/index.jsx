import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
import { useGetProfileQuery } from "../../../redux/auth/authApiSlice";
import { API_BASE_URL } from "../../../constants";
import LinkElement from "../NavBar/LinkElement";
import { data } from "../../../data/navData";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import { selectSideNavStatus } from "../../../redux/sideBar.slice";
import { useSelector } from "react-redux";
const PageLayout = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [expand, setExpand] = useState({ status: false, key: 0 });
  const sideNavOpen = useSelector(selectSideNavStatus);
  const { data: user, isSuccess, isLoading } = useGetProfileQuery();
  return (
    <div className="flex overflow-x-hidden">
      <NavBar />
      <aside
        className={
          "sticky bg-secondary h-screen overflow-y-hidden shadow-2xl duration-500 transition-all transform" +
          (sideNavOpen
            ? "w-[60%] lg:w-[35%] xl:w-[28%] 2xl:w-[25%]"
            : " w-[5%]")
        }
      >
        <article className="relative w-full pb-10 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden h-full ">
          <header
            className={`absolute w-[90%] backdrop-blur-[100px] p-1 rounded-xl font-bold flex items-center justify-between top-[10%] left-[5%] shadow-xl drop-shadow-xl z-10 transition-all duration-500 ${
              sideNavOpen ? "!top-[10%]" : "!-top-full"
            }`}
          >
            <img
              src={
                isSuccess && !isLoading ? API_BASE_URL + user.Image?.URL : ""
              }
              alt={isSuccess && !isLoading ? user.Name : "Profile"}
              className={`!w-20 !h-20 md:!w-28 md:!h-28 rounded-xl bg-secondary transition-all duration-500 `}
            />
            <div>
              <p className="font-bold text-tiny md:text-smaller xl:text-small text-primary text-center px-1">
                {isSuccess && !isLoading && user.Name}
              </p>
              <p className="font-semibold text-[14px] md:text-[16px] lg:text-tiny text-white text-center px-2">
                {isSuccess && !isLoading && user.Title}
              </p>
            </div>
            {/* <MdClose
                className="text-primary !text-[30px] mx-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              /> */}
          </header>

          <div className="h-[500px] w-[500px] rounded-full bg-primary/50 blur-[120px] absolute -top-[25%] -left-[50%]" />
          <div
            className={`${
              sideNavOpen
                ? "h-[180px] md:min-h-[250px]"
                : "h-[80px] md:min-h-[100px]"
            }  !w-full transition-all duration-300`}
          />
          <div
            className={`h-full flex flex-col justify-start items-start space-y-6 w-full px-1.5 z-20`}
          >
            {data.map((e, i) =>
              e.link ? (
                <LinkElement
                  icon={e.icon}
                  key={e.link}
                  name={e.name}
                  link={e.link}
                  drawerOpen={sideNavOpen}
                />
              ) : (
                <div className="w-full" key={i}>
                  <div
                    onClick={() => {
                      // setIsOpen(true);
                      setExpand({
                        status: expand.key == i ? !expand.status : true,
                        key: i,
                      });
                    }}
                    className={`${
                      expand.key == i && expand.status
                        ? "text-primary"
                        : "text-white"
                    } font-semibold text-tiny md:text-smaller 2xl:text-small flex justify-between items-center`}
                  >
                    <div className="flex items-center">
                      {e.icon && (
                        <img
                          className="object-contain w-10 h-10 min-w-10 min-h-10"
                          src={e.icon}
                          alt={e.name}
                        />
                      )}
                      {sideNavOpen && (
                        <p className={`px-1 cursor-pointer whitespace-nowrap`}>
                          {e.name}
                        </p>
                      )}
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
                          drawerOpen={sideNavOpen}
                          onClick={() => {
                            // setIsOpen(false);
                            // setExpand({ ...expand, status: false });
                          }}
                          styled={"pl-5 py-2"}
                        />
                      );
                    })}
                  </Collapse>
                </div>
              )
            )}
          </div>
        </article>
      </aside>
      <main className="pt-24 w-full h-full max-h-screen overflow-x-hidden overflow-y-scroll">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
