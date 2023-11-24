import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import PageModal from "../../components/Admin/layout/PageModal";
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
} from "@mui/material";
import RoleResourceController from "./RoleResourceController";
import RoleUsers from "./RoleUsers";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
const defaultFormState = {
  id: "",
  Name: "",
  ActiveStatus: true,
  Role_Resources: [],
};
const RoleDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const {
    errors,
    handleChange,
    handleSubmit,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(submit, defaultFormState);
  const [RoleResources, setRoleResources] = useState([]);
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
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
          setValues(data);
          setRoleResources(data.Role_Resources);
        }
      } else {
        setValues(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);

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
      setValues(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setErrors({});
  };
  function submit(event) {
    if (drawerID == "") {
      //add
      addRole({
        form: {
          Name: values.Name,
          ActiveStatus: values.ActiveStatus,
        },
      });
    } else {
      //update
      updateRole({
        id: drawerID,
        form: {
          Name: values.Name,
          ActiveStatus: values.ActiveStatus,
        },
      });
    }
  }
  const formRef = useRef(null);

  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Role")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile]);
  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-cente">
      <div className="py-8 md:mx-12 ">
        {disableField && (
          <div className="flex m-4">
            <p className="font-bold text-[24px] text-center">
              You Don't Have the Permission To Edit Roles !
            </p>
          </div>
        )}
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Name"
            label="Name"
            id="nameAr"
            onChange={handleChange}
            value={values.Name}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Name)}
            helperText={errors?.Name}
            disabled={disableField}
          />
        </div>
        {!disableField && (
          <div className="flex m-4">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleChange}
                    name="ActiveStatus"
                    value={values.ActiveStatus}
                    checked={values.ActiveStatus}
                    disabled={disableField}
                  />
                }
                label={values.isActive ? "Active" : "InActive"}
              />
            </FormGroup>
          </div>
        )}
        {profile.Role.Role_Resources.find((x) => x.resource.Name == "Users")
          .Read == true && (
          <div className="space-y-5">
            {drawerID !== "" && RoleResources.length !== 0 && (
              <RoleResourceController
                id={drawerID}
                RoleResources={RoleResources}
                changeResourceSettings={changeResourceSettings}
              />
            )}
            {drawerID !== "" && <RoleUsers id={drawerID} Name={values.Name} />}
          </div>
        )}
      </div>
    </form>
  );
  return (
    profileIsSuccess && (
      <>
        <PageDrawer
          isOpen={drawerOpen && drawerID !== ""}
          title={values.Name}
          newItem={false}
          editable={true}
          onCancelClick={closeDrawer}
          onSaveClick={handleSubmit}
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
        <PageModal
          isOpen={drawerOpen && drawerID == ""}
          title={"New Role"}
          newItem={false}
          editable={!disableField}
          onCancelClick={closeDrawer}
          onSaveClick={handleSubmit}
          disabled={disabled}
          modalWidth={"max-w-[70vw]"}
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
      </>
    )
  );
};

export default RoleDrawer;
