import React from "react";
import { Button, CardHeader, Paper, Divider } from "@mui/material";
import SearchBar from "./SearchBar";
import ColumnsToggler from "./table/ColumnsToggler";
import ExportMenu from "./table/ExportMenu";
import { systemSettings } from "../../settings";
const PageCard = (props) => {
  return (
    <Paper className="overflow-hidden" style={{ width: "100%" }}>
      <CardHeader
        style={{
          width: "100%",
        }}
        title={
          <div className="flex">
            {props.handleChangeTextBox && (
              <SearchBar
                searchText={props.searchText}
                handleChangeTextBox={props.handleChangeTextBox}
              />
            )}
            {props.categories && (
              <div
                className="ml-5"
                style={{
                  width: 350,
                  maxWidth: 350,
                }}
              >
                {props.categories}
              </div>
            )}
            {props.other && props.other}
          </div>
        }
        action={
          <div className="flex flex-row py-2 font-regular">
            {props.exportMenu && <ExportMenu {...props.exportMenu} />}

            {props.columnsToggler && (
              <ColumnsToggler
                columns={props.columnsOfTogglerColumns}
                handleCheckChange={props.handleCheckChange}
                //   appName={props.appName}
              />
            )}
            {props.otherButton && (
              <Button onClick={props.onClickSecondaryBtn}>
                {props.SecondaryButtonLabel}
              </Button>
            )}
            {props.multiButton && props.multiButton}
            {props.PrimaryButtonlabel && (
              <Button
                className="!bg-secondary !text-white"
                onClick={props.onClickPrimaryBtn}
              >
                <div className="font-regualr text-2xl">
                  {props.PrimaryButtonlabel}
                </div>
              </Button>
            )}
          </div>
        }
      />
      <Divider className="mx-0" />
      {props.table}
    </Paper>
  );
};

export default PageCard;
