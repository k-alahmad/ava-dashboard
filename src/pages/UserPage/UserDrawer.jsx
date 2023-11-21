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
import useForm from "../../hooks/useForm";
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
  Title: "",
  Image: "",
};
const UserDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const {
    errors,
    handleChange,
    values,
    setValues,
    handleSubmit,
    disabled,
    setErrors,
  } = useForm(submit, defaultFormState);
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
          setValues(data);
        }
      } else {
        setValues({
          ...defaultFormState,
        });
      }
    }
  }, [drawerID, data, drawerOpen, rolesSuccess]);

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
    setValues({ ...values, Image: e.target.files[0] });
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
    setImage(null);
    setErrors({});
    setImageURL(null);
    setOldImage(null);
  };
  function submit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Name", values.Name);
    formData.append("Title", values.Title);
    formData.append("Email", values.Email);
    formData.append("DOB", values.DOB);
    formData.append("Gender", values.Gender);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("roleID", values.roleID);
    formData.append("addressId", values.addressId);
    formData.append("teamID", values.teamID);
    formData.append("ActiveStatus", values.ActiveStatus);
    image && formData.append("Image", image);
    if (drawerID == "") {
      formData.append("Password", values.Password);

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
                src={API_BASE_URL + oldImage}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="flex flex-col m-4">
          <TextField
            fullWidth
            type="text"
            name="Name"
            label="Name *"
            id="Name"
            onChange={handleChange}
            value={values.Name}
            variant="outlined"
            size="small"
            error={Boolean(errors?.Name)}
            helperText={errors?.Name}
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Title"
            label="Title"
            id="Title"
            onChange={handleChange}
            value={values.Title}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Title)}
            helperText={errors?.Title}
          />
        </div>
        <div className="flex flex-col m-4">
          <TextField
            fullWidth
            type="text"
            name="Email"
            label="Email"
            id="Email"
            onChange={handleChange}
            value={values.Email}
            variant="outlined"
            size="small"
            required
            disabled={drawerID !== ""}
            error={Boolean(errors?.Email)}
            helperText={errors?.Email}
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
              value={values.Password}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.Password)}
              helperText={errors?.Password}
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
            value={values.PhoneNo}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.PhoneNo)}
            helperText={errors?.PhoneNo}
          />
        </div>
        <div className=" m-4">
          <InputLabel id="demo-simple-select-label">Date Of Birth*</InputLabel>
          <TextField
            fullWidth
            type="date"
            name="DOB"
            id="DOB"
            onChange={handleChange}
            value={values.DOB?.split("T")[0]}
            variant="outlined"
            size="small"
            error={Boolean(errors?.DOB)}
            helperText={errors?.DOB}
          />
        </div>
        <div className="flex m-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender*</InputLabel>
            <Select
              labelId="Gender"
              name="Gender"
              id="Gender"
              value={values.Gender}
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
              <InputLabel id="demo-simple-select-label">Role*</InputLabel>
              <Select
                labelId="roleID"
                name="roleID"
                id="roleID"
                value={values.roleID}
                label="Role"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                onAnimationEnd={() => selectSearchInput.current?.focus()}
                error={Boolean(errors?.roleID)}
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
              <p className="text-red-500 text-[14px] mx-4 font-[400]">
                {errors?.roleID}
              </p>
            </FormControl>
          </div>
        )}
        {teamsSuccess && (
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Team*</InputLabel>
              <Select
                labelId="teamID"
                name="teamID"
                id="teamID"
                value={values.teamID}
                label="Team"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                onAnimationEnd={() => selectSearchInput.current?.focus()}
                error={Boolean(errors?.teamID)}
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
              <p className="text-red-500 text-[14px] mx-4 font-[400]">
                {errors?.teamID}
              </p>
            </FormControl>
          </div>
        )}
        {addressesSuccess && (
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Address*</InputLabel>
              <Select
                labelId="addressId"
                name="addressId"
                id="addressId"
                value={values.addressId}
                label="Address"
                onChange={handleChange}
                MenuProps={{
                  autoFocus: false,
                  style: {
                    maxHeight: "400px",
                  },
                }}
                onClose={() => setSelectSearchTerm("")}
                onAnimationEnd={() => selectSearchInput.current?.focus()}
                error={Boolean(errors?.addressId)}
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
              <p className="text-red-500 text-[14px] mx-4 font-[400]">
                {errors?.addressId}
              </p>
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
                  value={values.ActiveStatus}
                  checked={values.ActiveStatus}
                />
              }
              label={values.ActiveStatus ? "Active" : "InActive"}
            />
          </FormGroup>
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New User" : values.Name}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={disabled}
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
