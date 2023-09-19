import clsx from "clsx";
import React from "react";

function FusePageSimpleSidebarContent(props) {
  const { classes } = props;

  return (
    // <Scrollbars enable={props.innerScroll}>
    <div>
      {props.header && (
        <div
          className={clsx(
            classes.sidebarHeader,
            props.variant,
            props.sidebarInner && classes.sidebarHeaderInnerSidebar
          )}
        >
          {props.header}
        </div>
      )}

      {props.content && (
        <div className={classes.sidebarContent}>{props.content}</div>
      )}
    </div>
  );
}

export default FusePageSimpleSidebarContent;
