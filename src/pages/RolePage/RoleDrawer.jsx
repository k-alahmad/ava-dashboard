import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddRoleMutation,
  useLazyGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "../../redux/roles/rolesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import RoleResourceController from "./RoleResourceController";
import RoleUsers from "./RoleUsers";

const defaultFormState = {
  id: "",
  Name: "",
  ActiveStatus: true,
  Role_Resources: [],
};
const RoleDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [RoleResources, setRoleResources] = useState([]);
  const [
    getRoleById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetRoleByIdQuery();
  const [addRole, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddRoleMutation();
  const [updateRole, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateRoleMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getRoleById({ id: drawerID });
        if (isSuccess) {
          setForm(data);
          setRoleResources(data.Role_Resources);
        }
      } else {
        setForm(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }
  function changeResourceSettings(e, item, type) {
    setRoleResources((current) =>
      current.map((obj) => {
        if (obj.id == item.id) {
          return {
            ...obj,
            Read:
              type == "Read"
                ? e.target.value == "true"
                  ? false
                  : true
                : obj.Read,
            Create:
              type == "Create"
                ? e.target.value == "true"
                  ? false
                  : true
                : obj.Create,
            Update:
              type == "Update"
                ? e.target.value == "true"
                  ? false
                  : true
                : obj.Update,
            Delete:
              type == "Delete"
                ? e.target.value == "true"
                  ? false
                  : true
                : obj.Delete,
          };
        }
        return obj;
      })
    );
  }
  useEffect(() => {
    if (addSuccess || updateSuccess) {
      setForm(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
  };
  function handleSubmit(event) {
    event.preventDefault();

    if (drawerID == "") {
      //add
      addRole({
        form: {
          Name: form.Name,
          ActiveStatus: form.ActiveStatus,
        },
      });
    } else {
      //update
      updateRole({
        id: drawerID,
        form: {
          Name: form.Name,
          ActiveStatus: form.ActiveStatus,
        },
      });
    }
  }
  const formRef = useRef(null);

  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-cente">
      <div className="py-8 md:mx-12 ">
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Name"
            label="Name"
            id="nameAr"
            onChange={handleChange}
            value={form.Name === "" ? "" : form.Name}
            variant="outlined"
            size="small"
            required
          />
        </div>

        <div className="flex m-4">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleChange}
                  name="ActiveStatus"
                  value={form.ActiveStatus}
                  checked={form.ActiveStatus}
                />
              }
              label={form.isActive ? "Active" : "InActive"}
            />
          </FormGroup>
        </div>
        <div className="space-y-5">
          {RoleResources.length !== 0 && (
            <RoleResourceController
              id={drawerID}
              RoleResources={RoleResources}
              changeResourceSettings={changeResourceSettings}
            />
          )}
          {drawerID !== "" && <RoleUsers id={drawerID} Name={form.Name} />}
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Role" : form.Name}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={form.Name == ""}
      children={
        isLoading || addLoading || updateLoading || isFetching ? (
          <div className="flex flex-row justify-center items-center h-full w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="text-med font-light">{formElements()}</div>
        )
      }
    />
  );
};

export default RoleDrawer;
