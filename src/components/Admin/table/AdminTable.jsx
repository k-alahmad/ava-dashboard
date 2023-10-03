import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
} from "@mui/material";
import clsx from "clsx";
import { useGlobalFilter, usePagination, useRowSelect } from "react-table";
import { useTable } from "../../../hooks/react-table/useTable";
import { useExportData } from "../../../hooks/react-table/useExportData";
import { useSortBy } from "../../../hooks/react-table/useSortBy";
import Utls from "./Utils";
import PaginationActions from "./PaginationActions";
const AdminTable = ({
  isShown,
  onMouseChange,
  columns,
  data,
  noDataMessage,
  onRowClick,
  searchText,
  isRowsEditable,
  onCellClick,
  dataCount,
}) => {
  const [filteredDataBySearch, setFilteredData] = useState([]);
  const {
    getTableProps,
    allColumns,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredDataBySearch,
      autoResetPage: true,
      initialState: {
        hiddenColumns: ["status"],
      },
    },
    useGlobalFilter,
    useSortBy,
    useExportData,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((_columns) => [..._columns]);
    }
  );
  const [rowId, setRowId] = React.useState();
  const [cellName, setCellName] = React.useState("");
  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };
  const getFilteredArray = (entities, _searchText) => {
    let selectedColumns = columns
      .filter((obj) => obj.checked === true)
      .map((item) => item.id);

    let arr = Object.keys(entities).map((id) => entities[id]);
    if (_searchText.length === 0) {
      return arr;
    }
    return Utls.filterArrayByString(arr, _searchText, selectedColumns);
  };
  useEffect(() => {
    //handling column show/hide changes
    allColumns.forEach((column) => {
      columns.forEach((changedColumn) => {
        if (
          column.id === changedColumn.id &&
          !(column.id === "action" || column.id === "monitor") &&
          !column.lockToggle
        )
          if (column.isVisible !== changedColumn.checked)
            //it means that it changed
            column
              .getToggleHiddenProps()
              .onChange({ target: { checked: changedColumn.checked } });
      });
    });
  }, [columns]);

  useEffect(() => {
    if (data) {
      setFilteredData(getFilteredArray(data, searchText));
    }
  }, [data, searchText]);

  if (!filteredDataBySearch) {
    return null;
  }

  if (filteredDataBySearch.length === 0 && dataCount == 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full ">
        <Typography
          color="textSecondary"
          variant="h5"
          style={{
            padding: "50px",
            textAlign: "center",
            fontFamily: "regular",
            fontSize: "44px",
          }}
        >
          {noDataMessage}
        </Typography>
      </div>
    );
  }

  const changeClickedCell = (cell) => {
    onCellClick(cell.row.id, cell.column.id); //, cell.value);
  };

  return (
    // <div>
    <Paper>
      {/* <div
        style={{
          borderColor: "black",
          overflowX: "initial",
          overflow: "auto",
          fontFamily: "FBold",
        }}
        className="max-h-[300px] shadow"
      > */}
      <TableContainer
        className="2xl:max-h-[550px]"
        style={{
          borderColor: "white",
          overflowX: "initial",
          overflow: "auto",
        }}
      >
        <Table {...getTableProps()} stickyHeader={true}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, i) => (
                  <TableCell
                    key={i}
                    className="whitespace-no-wrap p-12 sticky"
                    {...(!column.sortable
                      ? column.getHeaderProps()
                      : column.getHeaderProps(column.getSortByToggleProps()))}
                  >
                    {column.render("Header")}
                    {column.sortable ? (
                      <TableSortLabel
                        active={column.isSorted}
                        // react-table has a unsorted state which is not treated here
                        direction={column.isSortedDesc ? "desc" : "asc"}
                      />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row);
              return isRowsEditable ? (
                <TableRow
                  key={i}
                  {...row.getRowProps()}
                  className="truncate cursor-pointer "
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <TableCell
                        key={i}
                        {...cell.getCellProps()}
                        onClick={(ev) => changeClickedCell(cell)}
                        className={clsx("p-12 ", cell.column.className)}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ) : (
                <TableRow
                  key={i}
                  {...row.getRowProps()}
                  onClick={(ev) => onRowClick(ev, row)}
                  className="truncate cursor-pointer"
                >
                  {row.cells.map((cell, c) => {
                    return (
                      <TableCell
                        key={c}
                        {...cell.getCellProps()}
                        className={clsx("p-12 ", cell.column.className)}
                        onMouseEnter={() => {
                          setCellName(cell.column.id);
                          if (cell.column.hover) {
                            setRowId(row.id);
                            onMouseChange(true);
                          }
                        }}
                        onMouseLeave={() => {
                          setCellName();
                          if (cell.column.hover) {
                            setRowId("");
                            onMouseChange(false);
                          }
                        }}
                      >
                        <div
                          style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontFamily: "regular",
                            fontSize: "18px",
                            maxWidth: "250px",
                          }}
                        >
                          {cell.render("Cell")}
                        </div>
                        {cell.column.id === cellName &&
                        rowId === row.id &&
                        isShown ? (
                          <div
                            style={{
                              backgroundColor: "grey",
                              position: "fixed",
                              padding: "15px",
                              borderRadius: "20px",
                              color: "white",
                              margin: "auto",
                              fontFamily: "regular",
                              fontSize: "20px",
                            }}
                          >
                            <Typography
                              style={{
                                width: "250px",
                                display: "inline",
                                fontFamily: "FMed",
                                fontSize: "20px",
                              }}
                            >
                              {cellName} : <br /> {cell.render("Cell")}
                            </Typography>
                          </div>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex flex-col justify-center items-center w-full">
        <TablePagination
          // classes={{
          //   root: "w-full",
          //   spacer: "w-0 max-w-0",
          // }}
          style={{ border: "none" }}
          rowsPerPageOptions={[
            5,
            10,
            25,
            { label: "All", value: dataCount + 1 },
          ]}
          colSpan={5}
          count={dataCount ?? 0}
          rowsPerPage={pageSize}
          page={pageIndex}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: false,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={PaginationActions}
        />
      </div>
    </Paper>
  );
};

export default AdminTable;
