import React from "react";

import { Input, Paper } from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const SearchBar = (props) => {
  return (
    <Paper
      className="flex p-4 items-center w-full max-w-[384px] px-8 py-2 rounded font-regular"
      elevation={1}
    >
      {/* <Icon className="mr-8" color="action"> */}
      <SearchRoundedIcon className="self-center mx-2" color="action" />
      {/* </Icon> */}
      <Input
        placeholder="Search for anything"
        className="flex flex-1 font-regular"
        disableUnderline
        fullWidth
        value={props.searchText}
        inputProps={{
          "aria-label": "Search",
        }}
        onChange={props.handleChangeTextBox}
        style={{ fontFamily: "FMed", fontSize: "24px" }}
      />
    </Paper>
  );
};

export default SearchBar;
