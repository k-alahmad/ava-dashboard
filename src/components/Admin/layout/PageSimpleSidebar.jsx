import { Drawer, Hidden, SwipeableDrawer } from "@mui/material";
import clsx from "clsx";
import { forwardRef, useImperativeHandle, useState } from "react";
import PageSimpleSidebarContent from "./PageSimpleSidebarContent";

function PageSimpleSidebar(props, ref) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleSidebar: handleToggleDrawer,
  }));

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Hidden lgUp={props.variant === "permanent"}>
        <SwipeableDrawer
          variant="temporary"
          anchor={props.position}
          open={isOpen}
          onOpen={(ev) => {}}
          onClose={(ev) => handleToggleDrawer()}
          disableSwipeToOpen
          classes={{
            root: clsx(
              "overflow-hidden bg-[transparent] absolute lg:relative",
              props.variant
            ),
            paper: clsx(
              "absolute lg:bg-[gold] lg:text-[black] lg:relative",
              props.variant
              //   props.position === "left"
              //     ? classes.leftSidebar
              //     : classes.rightSidebar
            ),
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          container={props.rootRef.current}
          BackdropProps={{
            classes: {
              root: "absolute",
            },
          }}
          style={{ position: "absolute" }}
        >
          <PageSimpleSidebarContent {...props} />
        </SwipeableDrawer>
      </Hidden>
      {props.variant === "permanent" && (
        <Hidden mdDown>
          <Drawer
            variant="permanent"
            className={clsx(
              "overflow-hidden bg-[transparent] absolute lg:relative",
              props.variant
            )}
            open={isOpen}
            classes={{
              paper: clsx(
                "absolute lg:bg-[gold] lg:text-[black] lg:relative",
                props.variant
                // props.position === "left"
                //   ? classes.leftSidebar
                //   : classes.rightSidebar
              ),
            }}
          >
            <PageSimpleSidebarContent {...props} />
          </Drawer>
        </Hidden>
      )}
    </>
  );
}

export default forwardRef(PageSimpleSidebar);
