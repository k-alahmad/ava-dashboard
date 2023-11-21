import React from "react";

import { Input, Paper } from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const SearchBar = (props) => {
  return (
    <Paper
      className="flex p-4 items-center w-full max-w-[500px] px-8 py-2 rounded font-regular"
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
        type="text"
        id="table-search"
        value={props.searchText}
        inputProps={{
          "aria-label": "Search",
          "aria-autocomplete": "none",
        }}
        onChange={props.handleChangeTextBox}
        style={{ fontSize: "24px" }}
        autoComplete="off"
        aria-autocomplete="none"
      />
    </Paper>
  );
};

export default SearchBar;
