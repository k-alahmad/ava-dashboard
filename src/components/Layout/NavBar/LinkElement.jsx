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
          borderBottomColor: isActive
            ? systemSettings.colors.primary
            : systemSettings.colors.third,
          borderBottomWidth: isActive ? 3 : 0,
          paddingBottom: 8,
        };
      }}
      to={link}
    >
      <p className={`px-1 cursor-pointer font-medium text-smaller ${styled}`}>
        {name}
      </p>
    </NavLink>
  );
};

export default LinkElement;
