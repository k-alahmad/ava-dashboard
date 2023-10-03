import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuList,
  IconButton,
  Checkbox,
  Tooltip,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
const ColumnsToggler = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const columns = props.columns;
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    setAnchorEl(null);
  };
  return (
    <div className="ml-0 m-auto ">
      <Tooltip arrow title="Customize Columns">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className="p-3"
        >
          {/* <img src={""} style={{ width: "30px" }} alt="customize columns" /> */}
          <MoreVertRoundedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="selectedColumnsMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={handleClose}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              props.handleCheckChange(null);
            }}
            style={{ padding: 0 }}
          >
            <label className="w-full flex items-center min-w-[135px] px-2 py-5 font-regular text-2xl">
              Toggle All
            </label>
          </MenuItem>

          {columns.map((column, i) => (
            <div
              key={i}
              onChange={() => {
                props.handleCheckChange(column.id);
              }}
              style={{ padding: 0 }}
            >
              <MenuItem key={column.id} style={{ padding: 0 }}>
                <label className="w-full flex items-center min-w-[135px] px-2 py-5 font-regular text-2xl">
                  {column.name}
                  <div className="pl-0 ml-auto">
                    <Checkbox
                      color="secondary"
                      className="p-0"
                      checked={column.checked}
                    />
                  </div>
                </label>
              </MenuItem>
            </div>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default ColumnsToggler;
