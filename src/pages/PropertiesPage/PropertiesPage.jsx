import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "./PropertiesListColumns";
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
  useDeletePropertyMutation,
  useGetPropertiesQuery,
} from "../../redux/properties/propertiesSlice";
import PropertyDrawer from "./PropertiesDrawer";
import { Add } from "@mui/icons-material";
const PropertyPage = () => {
  const {
    data: properties,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPropertiesQuery();
  const [
    deleteProperty,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeletePropertyMutation();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerID, setDrawerID] = useState("");
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
      deleteProperty({ id: data.id })
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
    exportToCSV("Properties", columns, properties);
  };
  return (
    <>
      <PropertyDrawer
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
            PrimaryButtonlabel={<Add fontSize="large" />}
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
                  noDataMessage="There are no Properties"
                  searchText={searchText}
                  columns={columns}
                  loading={isLoading}
                  data={properties?.entities}
                  dataCount={properties?.ids?.length}
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

export default PropertyPage;