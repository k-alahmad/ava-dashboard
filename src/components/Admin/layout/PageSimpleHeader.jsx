import React from "react";
function PageSimpleHeader(props) {
  return (
    <div
      className={
        "min-h-36 h-36 sm:h-68 sm:min-h-68 " +
        "h-[] min-h-[] flex text-black bg-cover"
      }
    >
      {props.header && <>{props.header}</>}
    </div>
  );
}

export default PageSimpleHeader;
