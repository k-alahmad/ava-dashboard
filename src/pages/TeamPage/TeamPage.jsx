import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "./TeamListColumns";
import {
  toggleAllColumns,
  exportToCSV,
  toggleColumn,
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
  useGetTeamsQuery,
  useDeleteTeamMutation,
} from "../../redux/teams/teamsSlice";
import TeamDrawer from "./TeamDrawer";
import { Add } from "@mui/icons-material";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

const TeamPage = () => {
  const {
    data: teams,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetTeamsQuery();
  const [
    deleteTeam,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteTeamMutation();
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
    setDeletedName(model.Title);
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
      deleteTeam({ id: data.id })
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
  }, [isSuccess]);
  const handleOnCSVExport = () => {
    exportToCSV("Teams", columns, teams);
  };
  return (
    <>
      <TeamDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerID={drawerID}
        setDrawerID={setDrawerID}
      />
      {profileIsSuccess && (
        <PageSimple
          content={
            <PageCard
              searchText={searchText}
              handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
              PrimaryButtonlabel={
                profile.Role.Role_Resources.find(
                  (x) => x.resource.Name == "Team"
                ).Create == true && <Add fontSize="large" />
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
                  isSuccess && (
                    <AdminTable
                      noDataMessage="There are no Teans"
                      searchText={searchText}
                      columns={columns}
                      loading={isLoading}
                      data={teams?.entities}
                      dataCount={teams?.ids?.length}
                      onRowClick={(ev, row) => {
                        setDrawerID(row.original?.id);
                        setDrawerOpen(true);
                      }}
                    />
                  )
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
              exportMenu={{
                onCSVExport: handleOnCSVExport,
              }}
            />
          }
          sidebarInner
          ref={pageLayout}
          innerScroll
        />
      )}
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

export default TeamPage;
