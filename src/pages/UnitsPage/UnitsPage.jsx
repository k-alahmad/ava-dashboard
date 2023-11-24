import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "./UnitsListColumns";
import {
  toggleAllColumns,
  toggleColumn,
  exportToCSV,
} from "../../utils/table-helper";
import PageSimple from "../../components/Admin/layout/PageSimple";

import { CircularProgress } from "@mui/material";
import DeleteDialog from "../../components/Admin/DeleteDialog";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import { hideMessage, showMessage } from "../../redux/messageAction.slice";
import {
  useDeleteUnitMutation,
  useGetUnitQuery,
} from "../../redux/units/unitsSlice";
import UnitsDrawer from "./UnitsDrawer";
import { Add } from "@mui/icons-material";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

const UnitsPage = () => {
  const {
    data: units,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetUnitQuery();
  const [
    deleteUnit,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteUnitMutation();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerID, setDrawerID] = useState("");
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();

  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.email);
    dispatch(openDeleteDialog(model));
  };

  useEffect(() => {
    if (isError) {
      dispatch(
        showMessage({
          message: error,
          variant: "error",
        })
      );
    }
    if (deleteIsSuccess) {
      dispatch(
        showMessage({
          message: "Deleted!",
          variant: "success",
        })
      );
    }
    if (deleteIsError) {
      dispatch(
        showMessage({
          message: deleteError,
          variant: "error",
        })
      );
    }
  }, [isError, deleteIsError, deleteIsSuccess]);
  const [columns, setColumns] = useState(ComposeColumns(onDelete));
  function yesDeleteContact(flg, data) {
    if (flg === true) {
      //delete
      deleteUnit({ id: data.id })
        .then((payload) => {
          dispatch(closeDeleteDialog());
        })
        .catch(() => {
          dispatch(closeDeleteDialog());
        });
    } else {
      //do nothing
      dispatch(closeDeleteDialog());
    }
  }
  const handleToggleColumn = (columnId) => {
    //it's a toggle all
    if (!columnId) setColumns(toggleAllColumns(columns));
    else setColumns(toggleColumn(columns, columnId));
  };
  useEffect(() => {
    dispatch(hideMessage());
  }, []);
  const handleOnCSVExport = () => {
    exportToCSV("Units", columns, units);
  };
  return (
    <>
      <UnitsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerID={drawerID}
        setDrawerID={setDrawerID}
      />

      <PageSimple
        content={
          <PageCard
            searchText={searchText}
            handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
            PrimaryButtonlabel={
              profile.Role.Role_Resources.find((x) => x.resource.Name == "Unit")
                .Create == true && <Add fontSize="large" />
            }
            onClickPrimaryBtn={(ev) => {
              setDrawerID("");
              setDrawerOpen(true);
            }}
            table={
              isLoading || isFetching ? (
                <div className="flex flex-row justify-center items-center p-44">
                  <CircularProgress color="primary" />
                </div>
              ) : (
                <AdminTable
                  noDataMessage="There are no Units"
                  searchText={searchText}
                  columns={columns}
                  loading={isLoading}
                  data={units?.entities}
                  dataCount={units?.ids?.length}
                  onRowClick={(ev, row) => {
                    setDrawerID(row.original?.id);
                    setDrawerOpen(true);
                  }}
                />
              )
            }
            handleCheckChange={(columnId) => handleToggleColumn(columnId)}
            columnsOfTogglerColumns={columns
              .filter(
                (column) =>
                  !(column.id === "action" || column.id === "monitor") &&
                  !column.lockToggle
              )
              .map((column) => ({
                name: column.Header,
                id: column.id,
                checked: column.checked,
              }))}
            columnsToggler
            // exportMenu={{
            //   onCSVExport: handleOnCSVExport,
            // }}
          />
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <DeleteDialog
        deletedName={deletedName}
        loading={deleteLoading}
        yesDeleteClick={(bool, data) => {
          yesDeleteContact(bool, data);
        }}
      />
    </>
  );
};

export default UnitsPage;
