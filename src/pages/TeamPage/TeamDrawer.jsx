import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import Button from "../../components/UI/Button";
import {
  useAddTeamMutation,
  useLazyGetTeamByIdQuery,
  useUpdateTeamMutation,
} from "../../redux/teams/teamsSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import TeamUsers from "./TeamUsers";
import { API_BASE_URL } from "../../constants";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
const defaultFormState = {
  id: "",
  Title: "",
  Description: "",
  Image: "",
  ViewTag: false,
  ActiveStatus: true,
};
const TeamDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const {
    handleChange,
    handleSubmit,
    errors,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(submit, defaultFormState);
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [
    getTeamById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetTeamByIdQuery();
  const [addTeam, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddTeamMutation();
  const [updateTeam, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateTeamMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getTeamById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setValues(data);
        }
      } else {
        setValues(defaultFormState);
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
    setImageURL(null);
    setOldImage(null);
    setErrors({});
  };
  function submit(event) {
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("Description", values.Description);
    formData.append("ActiveStatus", values.ActiveStatus);
    formData.append("ViewTag", values.ViewTag);
    if (image) formData.append("Image", image);
    if (drawerID == "") {
      //add
      addTeam({
        formData,
      });
    } else {
      //update
      updateTeam({
        id: drawerID,
        formData,
      });
    }
  }

  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Team")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile, drawerID]);
  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-center">
      <div className="py-8 md:mx-12">
        <div className="flex flex-row items-center justify-center">
          {!disableField && (
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
          )}

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
            disabled={disableField}
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Description"
            label="Description"
            id="Description"
            onChange={handleChange}
            value={values.Description}
            variant="outlined"
            size="small"
            required
            multiline
            rows={5}
            error={Boolean(errors?.Description)}
            helperText={errors?.Description}
            disabled={disableField}
          />
        </div>
        <div className="flex m-4">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleChange}
                  name="ViewTag"
                  value={values.ViewTag}
                  checked={values.ViewTag}
                  disabled={disableField}
                />
              }
              label={values.ViewTag ? "View In Website" : "Hide In Website"}
            />
          </FormGroup>
        </div>
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
        {drawerID !== "" &&
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Users")
            .Read == true && (
            <div className="space-y-5">
              <TeamUsers id={drawerID} Title={values.Title} />
            </div>
          )}
      </div>
    </form>
  );
  return (
    profileIsSuccess && (
      <PageDrawer
        isOpen={drawerOpen}
        title={drawerID == "" ? "New Team" : values.Title}
        newItem={drawerID == "" && true}
        editable={!disableField}
        onCancelClick={closeDrawer}
        disabled={disabled}
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
    )
  );
};

export default TeamDrawer;
