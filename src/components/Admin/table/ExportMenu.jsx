import React, { useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, MenuList, IconButton, Tooltip } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import exportTable from "../../../assets/icons/export.svg";

// const useStyles = makeStyles((theme) => ({
//   item: {
//     width: "100%",
//     display: "flex",
//     alignItems: "center",
//     cursor: "pointer",
//     minWidth: "135px",
//   },
//   iconButton: {
//     padding: 5,
//   },
//   iconWrapper: {
//     display: "flex",
//     alignItems: "center",
//     paddingTop: 10,
//   },
// }));

// const useStylesBootstrap = makeStyles((theme) => ({
//   arrow: {
//     color: theme.palette?.common?.black,
//   },
//   tooltip: {
//     backgroundColor: theme.palette?.common?.black,
//   },
// }));

function BootstrapTooltip(props) {
  //   const classes = useStylesBootstrap();

  return <Tooltip arrow {...props} />;
}

export default function ExportMenu({ onPdfExport, onCSVExport }) {
  const [anchorEl, setAnchorEl] = useState(null);
  //   const classes = useStyles();

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
    //  className={classes.iconWrapper}
    >
      <BootstrapTooltip title="Export">
        <IconButton
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          //   className={classes.iconButton}
        >
          <img src={exportTable} style={{ width: "30px" }} alt="export table" />
        </IconButton>
      </BootstrapTooltip>
      <Menu
        id="exportMenu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        keepMounted
        onClose={handleClose}
      >
        <MenuList>
          {/* <MenuItem
            onClick={() => {
              onPdfExport();
              handleClose();
            }}
          >
            <label className={classes.item}>Export to .pdf</label>
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              onCSVExport();
              handleClose();
            }}
          >
            <label
            //  className={classes.item}
            >
              Export to .csv
            </label>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
