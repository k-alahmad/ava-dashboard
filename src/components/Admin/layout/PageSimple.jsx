import clsx from "clsx";
import { forwardRef, useImperativeHandle, memo, useRef } from "react";
import PageSimpleSidebar from "./PageSimpleSidebar";
import PageSimpleHeader from "./PageSimpleHeader";
const PageSimple = forwardRef((props, ref) => {
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const rootRef = useRef(null);

  useImperativeHandle(ref, () => ({
    rootRef,
    toggleLeftSidebar: () => {
      leftSidebarRef.current.toggleSidebar();
    },
    toggleRightSidebar: () => {
      rightSidebarRef.current.toggleSidebar();
    },
  }));

  return (
    <div
      className={clsx(" flex flex-col", props.innerScroll && "h-full  ")}
      ref={rootRef}
      style={{ width: "100%" }}
    >
      {/* <div
        className={clsx(
          "h-[100px] min-h-[100px] flex text-[black] bg-cover",
          "top-0 inset-x-0 pointer-events-none"
        )}
      /> */}

      <div className="flex flex-auto flex-col z-10 h-full px-6">
        {props.header && props.sidebarInner && (
          <PageSimpleHeader header={props.header} />
        )}

        <div className="flex flex-row flex-1 max-w-full min-w-0 h-full bg-[gold] z-2">
          {(props.leftSidebarHeader || props.leftSidebarContent) && (
            <PageSimpleSidebar
              position="left"
              header={props.leftSidebarHeader}
              content={props.leftSidebarContent}
              variant={props.leftSidebarVariant || "permanent"}
              innerScroll={props.innerScroll}
              sidebarInner={props.sidebarInner}
              ref={leftSidebarRef}
              rootRef={rootRef}
            />
          )}

          {/* <FuseScrollbars
            className="flex flex-col flex-1 overflow-auto z-50 "
            enable={props.innerScroll && !props.sidebarInner}
          > */}
          <div className="flex flex-col flex-1 overflow-auto z-50 ">
            {props.header && !props.sidebarInner && (
              <PageSimpleHeader header={props.header} />
            )}

            {props.contentToolbar && (
              <div className="h-[64px] min-h-[64px] flex items-center">
                {props.contentToolbar}
              </div>
            )}

            {props.content && <div className="flex-1">{props.content}</div>}
            {/* </FuseScrollbars> */}
          </div>

          {(props.rightSidebarHeader || props.rightSidebarContent) && (
            <PageSimpleSidebar
              position="right"
              header={props.rightSidebarHeader}
              content={props.rightSidebarContent}
              variant={props.rightSidebarVariant || "permanent"}
              innerScroll={props.innerScroll}
              sidebarInner={props.sidebarInner}
              ref={rightSidebarRef}
              rootRef={rootRef}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default memo(PageSimple);
