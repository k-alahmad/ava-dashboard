import React from "react";
import Loader from "../Loader";
const Back = ({ loading, icon, text }) => {
  return (
    <>
      {!loading && icon ? <div className="px-1">{icon}</div> : null}
      {!loading && <p className="px-1">{text}</p>}
    </>
  );
};
const Normal = ({ loading, icon, text }) => {
  return (
    <>
      {!loading && text ? <div className="px-1">{text}</div> : null}
      {!loading && icon ? <div className="px-1">{icon}</div> : null}
    </>
  );
};
const Button = ({
  bgColor,
  borderColor,
  text,
  textColor,
  big,
  icon,
  customStyle,
  onClick,
  loading,
  disabled,
  h,
  w,
  back,
}) => {
  return (
    <button
      style={{
        borderRadius: 27,
        border: borderColor ? "1px solid" : 1,
        width: w ?? "100%",
        height: h ?? "100%",
        transition: "0.4s",
      }}
      className={`text-center p-1 py-1 lg:max-w-[228px] my-2 flex items-center justify-center text-smaller font-fmed ${customStyle} ${
        disabled ? "bg-gray-500" : bgColor
      } ${textColor} ${borderColor} ${loading && "py-3"} cursor-pointer`}
      onClick={onClick}
      disabled={disabled}
    >
      {back ? (
        <Back text={text} icon={icon} loading={loading} />
      ) : (
        <Normal text={text} icon={icon} loading={loading} />
      )}
      {loading && <Loader big={big} />}
    </button>
  );
};

export default Button;
