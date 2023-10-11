import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";
// import { Close as MdClose } from "@mui/icons-material";
import { useGetProfileQuery } from "../../../redux/auth/authApiSlice";
import { API_BASE_URL } from "../../../constants";
import LinkElement from "../NavBar/LinkElement";
import { data } from "../../../data/navData";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Collapse } from "@mui/material";

const PageLayout = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [expand, setExpand] = useState({ status: false, key: 0 });

  const { data: user, isSuccess, isLoading } = useGetProfileQuery();
  return (
    <div className="flex overflow-x-hidden">
      <NavBar
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setExpand={setExpand}
        expand={expand}
      />
      <aside
        className={
          "sticky bg-secondary h-screen overflow-y-scroll shadow-2xl duration-500 transition-all transform" +
          (isOpen ? "w-[60%] lg:w-[35%] xl:w-[28%] 2xl:w-[25%]" : " w-[60px]")
        }
      >
        <article className="relative w-full pb-10 flex flex-col justify-start items-center overflow-y-auto overflow-x-hidden h-full ">
          <header
            className={`w-[90%] p-1 rounded-xl font-bold flex items-center justify-between absolute top-[10%] left-[5%] shadow-xl drop-shadow-xl z-10 transition-all duration-500 ${
              isOpen ? "scale-100" : "scale-0"
            }`}
          >
            <img
              src={
                isSuccess && !isLoading
                  ? API_BASE_URL + "/" + user.Image.URL
                  : ""
              }
              alt={isSuccess && !isLoading ? user.Name : "Profile"}
              className={`!w-20 !h-20 md:!w-28 md:!h-28 rounded-xl bg-secondary transition-all duration-500 `}
            />
            <p className="font-bold  text-tiny md:text-smaller lg:text-small text-primary text-center px-1">
              {isSuccess && !isLoading && user.Name}
            </p>
            {/* <MdClose
                className="text-primary !text-[30px] mx-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              /> */}
          </header>

          <div className="h-[500px] w-[500px] rounded-full bg-primary/50 blur-[120px] absolute -top-[25%] -left-[50%]" />
          <div className="h-[180px] md:min-h-[250px] !w-full" />
          <div
            className={`h-full flex flex-col justify-start items-start space-y-6 w-full px-1 `}
          >
            {data.map((e, i) =>
              e.link ? (
                <LinkElement
                  icon={e.icon}
                  key={e.link}
                  name={e.name}
                  link={e.link}
                  drawerOpen={isOpen}
                  // onClick={() => setMobileOpen(false)}
                />
              ) : (
                <div className="w-full" key={i}>
                  <div
                    onClick={() => {
                      setIsOpen(true);
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
                      {isOpen && (
                        <p className={`px-1 cursor-pointer whitespace-nowrap`}>
                          {e.name}
                        </p>
                      )}
                    </div>

                    {expand.status && expand.key == i
                      ? isOpen && <ExpandLess fontSize="large" />
                      : isOpen && <ExpandMore fontSize="large" />}
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
                          drawerOpen={isOpen}
                          onClick={() => {
                            // setIsOpen(false);
                            // setExpand({ ...expand, status: false });
                          }}
                          styled={"px-5 py-2"}
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
