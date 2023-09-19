import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "./UserListColumn";
import {
  toggleAllColumns,
  toggleColumn,
  exportToCSV,
} from "../../utils/table-helper";
import PageSimple from "../../components/Admin/layout/PageSimple";

import { CircularProgress } from "@mui/material";
import DeleteDialog from "../../components/Admin/DeleteDialog";
import CustomDialog from "../../components/Admin/CustomDialog";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import { hideMessage, showMessage } from "../../redux/messageAction.slice";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/users/usersSlice";
import UserDrawer from "./UserDrawer";
import {
  closeCustomDialog,
  openCustomDialog,
} from "../../redux/customDialogAction";
import { TextField } from "@mui/material";
const UserPage = () => {
  const {
    data: users,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();
  const [
    deleteUser,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteUserMutation();
  const [
    updateUser,
    {
      isSuccess: updateIsSuccess,
      isError: updateIsError,
      error: updateError,
      isLoading: updateLoading,
    },
  ] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerID, setDrawerID] = useState("");
  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.Email);
    dispatch(openDeleteDialog(model));
  };
  const onChangePassowrd = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(openCustomDialog(model));
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
    if (updateIsSuccess) {
      dispatch(
        showMessage({
          message: "Passowrd Updated",
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
    if (updateIsError) {
      dispatch(
        showMessage({
          message: updateError,
          variant: "error",
        })
      );
    }
  }, [isError, deleteIsError, deleteIsSuccess]);
  const [columns, setColumns] = useState(
    ComposeColumns(onDelete, onChangePassowrd)
  );
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
  function yesChangePassword(flg, data) {
    if (flg === true) {
      //delete
      updateUser({ id: data.id, formData: { Password: password } })
        .then((payload) => {
          dispatch(closeCustomDialog());
          setPassword("");
          setPasswordTwo("");
        })
        .catch(() => {
          dispatch(closeCustomDialog());
          setPassword("");
          setPasswordTwo("");
        });
    } else {
      //do nothing
      dispatch(closeCustomDialog());
      setPassword("");
      setPasswordTwo("");
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
    exportToCSV("Users", columns, users);
  };
  return (
    <>
      <UserDrawer
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
            PrimaryButtonlabel="New User"
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
                    noDataMessage="There are no Users"
                    searchText={searchText}
                    columns={columns}
                    loading={isLoading}
                    data={users?.entities}
                    dataCount={users?.ids?.length}
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
      <DeleteDialog
        deletedName={deletedName}
        loading={deleteLoading}
        yesDeleteClick={(bool, data) => {
          yesDeleteContact(bool, data);
        }}
      />
      <CustomDialog
        loading={updateLoading}
        confirmClick={(bool, data) => {
          yesChangePassword(bool, data);
        }}
        disabled={
          password !== passwordTwo ||
          password.replace(/ /g, "") == "" ||
          passwordTwo.replace(/ /g, "") == ""
        }
        confirmButtonName={"change Password"}
        body={
          <>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="password"
                name="Password"
                label="Password"
                id="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                variant="outlined"
                size="small"
                required
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="password"
                name="Password"
                label="Re-Type Password"
                id="Password"
                onChange={(e) => setPasswordTwo(e.target.value)}
                value={passwordTwo}
                variant="outlined"
                size="small"
                required
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default UserPage;
