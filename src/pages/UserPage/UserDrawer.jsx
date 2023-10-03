import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import Button from "../../components/UI/Button";
import {
  useAddUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../redux/users/usersSlice";
import { useGetActiveRolesQuery } from "../../redux/roles/rolesSlice";
import { useGetActiveTeamsQuery } from "../../redux/teams/teamsSlice";
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
} from "@mui/material";

import { API_BASE_URL } from "../../constants";
const defaultFormState = {
  id: "",
  Name: "",
  Email: "",
  DOB: "",
  Password: "",
  PhoneNo: "",
  Gender: "",
  roleID: "",
  teamID: "",
  ActiveStatus: true,
  Image: "",
};
const UserDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();

  const [
    getUserById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetUserByIdQuery();
  const {
    data: roles,
    isLoading: rolesLoading,
    isSuccess: rolesSuccess,
    isFetching: rolesIsFetching,
  } = useGetActiveRolesQuery();
  const {
    data: teams,
    isLoading: teamsLoading,
    isSuccess: teamsSuccess,
    isFetching: teamsIsFetching,
  } = useGetActiveTeamsQuery();
  const [addUser, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddUserMutation();
  const [updateUser, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getUserById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setForm(data);
        }
      } else {
        setForm(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);
  useEffect(() => {
    if (!image) {
      setImageURL(undefined);
    } else {
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);
  function onImageChange(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
    }
    setImage(e.target.files[0]);
    setForm({ ...form, Image: e.target.files[0] });
  }
  function handleChange(e) {
    if (e.target.name == "DOB") {
      setForm({
        ...form,
        DOB: e.target.value + "T00:00:00.000Z",
      });
    } else {
      setForm({
        ...form,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });
    }
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
    setImage(null);
    setImageURL(null);
    setOldImage(null);
  };
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Name", form.Name);
    formData.append("Email", form.Email);
    formData.append("DOB", form.DOB);
    formData.append("Gender", form.Gender);
    formData.append("PhoneNo", form.PhoneNo);
    formData.append("roleID", form.roleID);
    formData.append("teamID", form.teamID);
    formData.append("ActiveStatus", form.ActiveStatus);
    formData.append("Image", form.Image);
    if (drawerID == "") {
      formData.append("Password", form.Password);

      //add
      addUser({ formData });
    } else {
      //update
      updateUser({ id: drawerID, formData });
    }
  }
  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);

  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-center">
      <div className="py-8 mx-12">
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-col m-4">
            <Button
              textColor={"text-white font-regular"}
              text={"Upload Image"}
              bgColor={"bg-primary"}
              customStyle={"py-2 px-4"}
              onClick={(e) => {
                e.preventDefault();
                hiddenFileInput.current.click();
              }}
            />
            <input
              type="file"
              accept="images/*"
              onChange={onImageChange}
              style={{ display: "none" }}
              ref={hiddenFileInput}
            />
          </div>
          {imageURL && (
            <div className="flex flex-col m-4">
              <p className="text-smaller font-regular pb-1">New Image</p>
              <img className="h-[200px] w-[200px] " src={imageURL} alt="" />
            </div>
          )}
          {oldImage && (
            <div className="flex flex-col m-4">
              <p className="text-smaller font-regular pb-1">Current Image</p>

              <img
                className="h-[200px] w-[200px] "
                src={`${API_BASE_URL}/${oldImage}`}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Name"
            label="Name"
            id="Name"
            onChange={handleChange}
            value={form.Name === "" ? "" : form.Name}
            variant="outlined"
            size="small"
            required
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Email"
            label="Email"
            id="Email"
            onChange={handleChange}
            value={form.Email === "" ? "" : form.Email}
            variant="outlined"
            size="small"
            required
            disabled={drawerID !== ""}
          />
        </div>
        {drawerID == "" && (
          <div className="flex m-4">
            <TextField
              fullWidth
              type="password"
              name="Password"
              label="Password"
              id="Password"
              onChange={handleChange}
              value={form.Password === "" ? "" : form.Password}
              variant="outlined"
              size="small"
              required
            />
          </div>
        )}
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="PhoneNo"
            label="Phone Number"
            id="PhoneNo"
            onChange={handleChange}
            value={form.PhoneNo === "" ? "" : form.PhoneNo}
            variant="outlined"
            size="small"
            required
          />
        </div>
        <div className=" m-4">
          <InputLabel id="demo-simple-select-label">Date Of Birth</InputLabel>
          <TextField
            fullWidth
            type="date"
            name="DOB"
            id="DOB"
            onChange={handleChange}
            value={
              form.DOB?.split("T")[0] === "" ? "" : form.DOB?.split("T")[0]
            }
            variant="outlined"
            size="small"
          />
        </div>
        {rolesSuccess && (
          <div className=" flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="Role"
                name="roleID"
                id="roleID"
                value={form.roleID === "" ? "" : form.roleID}
                label="Role"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
              >
                {roles?.ids.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {roles.entities[item].Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        )}
        {teamsSuccess && (
          <div className=" flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Team</InputLabel>
              <Select
                labelId="Team"
                name="teamID"
                id="teamID"
                value={form.teamID === "" ? "" : form.teamID}
                label="Team"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
              >
                {teams?.ids.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {teams.entities[item].Title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        )}

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
              label={form.ActiveStatus ? "Active" : "InActive"}
            />
          </FormGroup>
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New User" : form.Email}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Name == "" ||
        form.DOB == "" ||
        form.Email == "" ||
        form.Password == "" ||
        form.PhoneNo == "" ||
        form.roleID == ""
      }
      children={
        isLoading ||
        addLoading ||
        updateLoading ||
        isFetching ||
        rolesLoading ||
        rolesIsFetching ||
        teamsLoading ||
        teamsIsFetching ? (
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

export default UserDrawer;
