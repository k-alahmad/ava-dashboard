import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import Button from "../../components/UI/Button";
import {
  useAddUserMutation,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../redux/users/usersSlice";
import { useGetActiveRolesQuery } from "../../redux/roles/rolesSlice";
import { useGetActiveTeamsQuery } from "../../redux/teams/teamsSlice";
import { useGetActiveAddressQuery } from "../../redux/addresses/addressesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  FormControl,
  Select,
  ListSubheader,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { Gender } from "../../constants/index";
import { API_BASE_URL } from "../../constants";
const defaultFormState = {
  id: "",
  Name: "",
  Email: "",
  DOB: "",
  Password: "",
  PhoneNo: "",
  Gender: "Male",
  roleID: "",
  teamID: "",
  addressId: "",
  ActiveStatus: true,
  Image: "",
  Role: { id: "", Name: "" },
  Address: {
    id: "",
    Address_Translation: [{ Language: { Code: "En" }, Name: "" }],
  },
  Team: { id: "", Title: "" },
};
const UserDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  var selectSearchInput = useRef(undefined);

  const [
    getUserById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetUserByIdQuery();
  const {
    data: roles,
    isLoading: rolesLoading,
    isSuccess: rolesSuccess,
    isFetching: rolesIsFetching,
    isError: rolesIsError,
    error: roleError,
  } = useGetActiveRolesQuery();
  const {
    data: teams,
    isLoading: teamsLoading,
    isSuccess: teamsSuccess,
    isFetching: teamsIsFetching,
    isError: teamsIsError,
    error: teamsError,
  } = useGetActiveTeamsQuery();
  const {
    data: addresses,
    isLoading: addressesLoading,
    isSuccess: addressesSuccess,
    isFetching: addressesIsFetching,
    isError: addressesIsError,
    error: addressesError,
  } = useGetActiveAddressQuery();
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
    formData.append("addressId", form.addressId);
    formData.append("teamID", form.teamID);
    formData.append("ActiveStatus", form.ActiveStatus);
    image && formData.append("Image", image);
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
      <div className="py-8 md:mx-12">
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
        <div className="flex m-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="Gender"
              name="Gender"
              id="Gender"
              value={form.Gender}
              label="Gender"
              onChange={handleChange}
              MenuProps={{
                style: {
                  maxHeight: "400px",
                },
              }}
            >
              {Gender?.map((item, j) => {
                return (
                  <MenuItem key={j} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        {rolesSuccess && (
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="roleID"
                name="roleID"
                id="roleID"
                value={form.roleID}
                label="Role"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                // renderValue={() => form.roleID}
                onAnimationEnd={() => selectSearchInput.current.focus()}
              >
                <ListSubheader>
                  <TextField
                    ref={selectSearchInput}
                    fullWidth
                    type="text"
                    name="SelectSearchTerm"
                    placeholder="Search for Role"
                    id="SelectSearchTerm"
                    onChange={(e) => setSelectSearchTerm(e.target.value)}
                    value={selectSearchTerm}
                    variant="outlined"
                    size="small"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        // Prevents autoselecting item while typing (default Select behaviour)
                        e.stopPropagation();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListSubheader>

                {roles.ids?.map((item, j) => {
                  if (
                    roles?.entities[item]?.Name.toLowerCase().includes(
                      selectSearchTerm.toLowerCase()
                    )
                  )
                    return (
                      <MenuItem key={j} value={item}>
                        {roles.entities[item].Name}
                      </MenuItem>
                    );
                })}
              </Select>
            </FormControl>
          </div>
        )}
        {teamsSuccess && (
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Team</InputLabel>
              <Select
                labelId="teamID"
                name="teamID"
                id="teamID"
                value={form.teamID}
                label="Team"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                onAnimationEnd={() => selectSearchInput.current.focus()}
              >
                <ListSubheader>
                  <TextField
                    ref={selectSearchInput}
                    fullWidth
                    type="text"
                    name="SelectSearchTerm"
                    placeholder="Search for Team"
                    id="SelectSearchTerm"
                    onChange={(e) => setSelectSearchTerm(e.target.value)}
                    value={selectSearchTerm}
                    variant="outlined"
                    size="small"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListSubheader>

                {teams.ids?.map((item, j) => {
                  if (
                    teams?.entities[item]?.Title.toLowerCase().includes(
                      selectSearchTerm.toLowerCase()
                    )
                  )
                    return (
                      <MenuItem key={j} value={item}>
                        {teams.entities[item].Title}
                      </MenuItem>
                    );
                })}
              </Select>
            </FormControl>
          </div>
        )}
        {addressesSuccess && (
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Address</InputLabel>
              <Select
                labelId="addressId"
                name="addressId"
                id="addressId"
                value={form.addressId}
                label="Address"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                onAnimationEnd={() => selectSearchInput.current.focus()}
              >
                <ListSubheader>
                  <TextField
                    ref={selectSearchInput}
                    fullWidth
                    type="text"
                    name="SelectSearchTerm"
                    placeholder="Search for Address"
                    id="SelectSearchTerm"
                    onChange={(e) => setSelectSearchTerm(e.target.value)}
                    value={selectSearchTerm}
                    variant="outlined"
                    size="small"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </ListSubheader>

                {addresses.ids?.map((item, j) => {
                  if (
                    addresses?.entities[item]?.Address_Translation.find(
                      (x) => x.Language.Code == "En"
                    )
                      ?.Name.toLowerCase()
                      .includes(selectSearchTerm.toLowerCase())
                  )
                    return (
                      <MenuItem key={j} value={item}>
                        {
                          addresses.entities[item]?.Address_Translation.find(
                            (x) => x.Language.Code == "En"
                          )?.Name
                        }
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
      // disabled={
      //   form.Name == "" ||
      //   form.DOB == "" ||
      //   form.Email == "" ||
      //   form.Password == "" ||
      //   form.PhoneNo == "" ||
      //   form.roleID == ""
      // }
      children={
        isLoading ||
        addLoading ||
        updateLoading ||
        isFetching ||
        rolesLoading ||
        rolesIsFetching ||
        teamsLoading ||
        teamsIsFetching ||
        addressesIsFetching ||
        addressesLoading ? (
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
