import { NavLink } from "react-router-dom";
import { systemSettings } from "../../../settings";
const LinkElement = ({ name, link, styled, onClick }) => {
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
      <p className={`px-1 cursor-pointer font-regular text-small ${styled}`}>
        {name}
      </p>
    </NavLink>
  );
};

export default LinkElement;
