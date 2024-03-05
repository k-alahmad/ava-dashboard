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
  const { data: user, isSuccess, isLoading, isFetching } = useGetProfileQuery();
  return (
    <div className="flex overflow-x-hidden">
      <NavBar />
      <aside
        className={
          "max-md:fixed z-40 md:sticky bg-secondary h-screen overflow-y-hidden shadow-2xl duration-500 transition-all transform " +
          (sideNavOpen ? " md:w-[400px] 2xl:w-[500px]" : "w-0 md:w-[100px]")
        }
      >
        <article className="relative w-full pb-10 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden h-full ">
          <header
            className={`absolute w-[90%] backdrop-blur-2xl p-1 rounded-xl font-bold flex items-center justify-between left-[5%] shadow-xl drop-shadow-xl z-10 transition-all duration-500 ${
              sideNavOpen ? "!top-[10%]" : "!-top-full"
            }`}
          >
            <img
              src={
                isSuccess && !isLoading && !isFetching
                  ? API_BASE_URL + user.Image?.URL
                  : ""
              }
              alt={
                isSuccess && !isLoading && !isFetching ? user.Name : "Profile"
              }
              className={`!w-20 !h-20 2xl:!w-28 2xl:!h-28 rounded-xl bg-secondary transition-all duration-500 `}
            />
            <div>
              <p className="font-bold text-tiny md:text-smaller 2xl:text-small text-primary text-center px-1">
                {isSuccess && !isLoading && user.Name}
              </p>
              <p className="font-semibold text-[14px] md:text-[16px] lg:text-tiny text-white text-center px-2">
                {isSuccess && !isLoading && user.Title}
              </p>
            </div>
          </header>

          <div className="h-[500px] w-[500px] rounded-full bg-primary/50 blur-[120px] absolute -top-[25%] -left-[50%]" />
          <div
            className={`${
              sideNavOpen
                ? "h-[250px] min-h-[250px]"
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
                      setExpand({
                        status: expand.key == i ? !expand.status : true,
                        key: i,
                      });
                    }}
                    className={`${
                      expand.key == i && expand.status
                        ? "text-primary"
                        : "text-white"
                    } font-semibold text-tiny 2xl:text-small flex justify-between items-center`}
                  >
                    <div className="flex items-center flex-1 ">
                      {e.icon && (
                        <img
                          className="object-contain w-6 h-6 2xl:w-10 2xl:h-10"
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
                      <ExpandLess
                        fontSize="large"
                        className={!sideNavOpen && "flex-1"}
                      />
                    ) : (
                      <ExpandMore
                        fontSize="large"
                        className={!sideNavOpen && "flex-1"}
                      />
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
