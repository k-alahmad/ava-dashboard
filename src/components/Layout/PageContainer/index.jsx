import React, { useEffect } from "react";
import NavBar from "../NavBar";
// import { useLazyGetProfileQuery } from "../../../redux/auth/authApiSlice";
const PageLayout = ({ children }) => {
  // const [getProfile, {}] = useLazyGetProfileQuery();
  useEffect(() => {
    window.scrollTo(0, 0);
    // getProfile();
  }, []);
  return (
    <div className="">
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default PageLayout;
