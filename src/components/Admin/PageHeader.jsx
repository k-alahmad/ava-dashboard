import React from "react";
import { Icon, Typography } from "@mui/material";

function PageHeader(props) {
  return (
    <div className={"flex flex-1 items-center justify-between p-8 sm:p-24 "}>
      <div className="flex flex-shrink items-center sm:w-270">
        <div className="flex items-center">
          {/* <FuseAnimate animation="transition.expandIn" delay={300}> */}
          <div>
            <Icon className="text-32">{props.pageIcon}</Icon>
          </div>
          {/* </FuseAnimate> */}
          {/* <FuseAnimate animation="transition.slideLeftIn" delay={300}> */}
          <div>
            <Typography
              variant="h6"
              className={"text-[#7B7B7B]" + " " + "mx-12 hidden sm:flex"}
            >
              {props.pageTitle}
            </Typography>
          </div>
          {/* </FuseAnimate> */}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
