import React, { useEffect } from "react";
import NavBar from "../NavBar";

const PageLayout = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="">
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
