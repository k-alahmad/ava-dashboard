import { NavLink } from "react-router-dom";
import { systemSettings } from "../../../settings";
const LinkElement = ({ name, link, styled, onClick, icon }) => {
  return (
    <NavLink
      onClick={onClick}
      style={({ isActive }) => {
        return {
          color: isActive
            ? systemSettings.colors.primary
            : systemSettings.colors.third,
          borderRadius: 2,
          width: "100%",
        };
      }}
      to={link}
    >
      <div className={`flex justify-start items-center gap-x-1  ${styled}`}>
        {icon && (
          <img className="object-contain w-10 h-10" src={icon} alt={name} />
        )}
        <p
          className={`cursor-pointer font-regular text-tiny md:text-smaller 2xl:text-small`}
        >
          {name}
        </p>
      </div>
    </NavLink>
  );
};

export default LinkElement;
