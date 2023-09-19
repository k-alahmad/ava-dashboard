import React, { useState, useEffect, useRef } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import {
  useDeleteUserMutation,
  useLazyGetUserByTeamIdQuery,
} from "../../redux/users/usersSlice";
import { showMessage, hideMessage } from "../../redux/messageAction.slice";
import { useDispatch } from "react-redux";
import PageSimple from "../../components/Admin/layout/PageSimple";
import PageCard from "../../components/Admin/PageCard";
import { CircularProgress } from "@mui/material";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "../UserPage/UserListColumn";
import {
  exportToCSV,
  toggleAllColumns,
  toggleColumn,
} from "../../utils/table-helper";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import DeleteDialog from "../../components/Admin/DeleteDialog";
const TeamUsers = ({ id, Title }) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const dispatch = useDispatch();

  const [
    getUserByTeamId,
    { data: users, isLoading, isFetching, isSuccess, isError, error },
  ] = useLazyGetUserByTeamIdQuery();
  useEffect(() => {
    if (id !== "") {
      getUserByTeamId({ id });
    }
  }, [id]);
  const [
    deleteUser,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteUserMutation();
  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.Email);
    dispatch(openDeleteDialog(model));
  };
  const [columns, setColumns] = useState(ComposeColumns(onDelete));

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
  function yesDeleteContact(flg, data) {
    if (flg === true) {
      //delete
      deleteUser({ id: data.id })
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
  useEffect(() => {
    dispatch(hideMessage());
  }, [isSuccess]);
  const handleToggleColumn = (columnId) => {
    //it's a toggle all
    if (!columnId) setColumns(toggleAllColumns(columns));
    else setColumns(toggleColumn(columns, columnId));
  };
  const handleOnCSVExport = () => {
    exportToCSV(Title + " Users", columns, users);
  };
  return (
    <div className="space-y-4">
      <button
        className="font-bold text-4xl cursor-pointer relative z-10 bg-white py-3 w-full text-start"
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        Users
        {open ? (
          <ArrowDropDown fontSize="large" />
        ) : (
          <ArrowDropUp fontSize="large" />
        )}
      </button>
      <div
        className={`${
          open
            ? "scale-y-100 translate-y-0 h-full"
            : "scale-y-0 -translate-y-[7%] h-0"
        } origin-top transition-all duration-500`}
      >
        <PageSimple
          content={
            <PageCard
              searchText={searchText}
              handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
              table={
                isLoading || isFetching ? (
                  <div className="flex flex-row justify-center items-center p-44">
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  isSuccess && (
                    <AdminTable
                      noDataMessage="There are no Users"
                      searchText={searchText}
                      columns={columns}
                      loading={isLoading}
                      data={users?.entities}
                      dataCount={users?.ids?.length}
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
        <DeleteDialog
          deletedName={deletedName}
          loading={deleteLoading}
          yesDeleteClick={(bool, data) => {
            yesDeleteContact(bool, data);
          }}
        />
      </div>
    </div>
  );
};

export default TeamUsers;
