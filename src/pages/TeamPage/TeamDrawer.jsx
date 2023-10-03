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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import TeamUsers from "./TeamUsers";
import { API_BASE_URL } from "../../constants";
const defaultFormState = {
  id: "",
  Title: "",
  Description: "",
  Image: "",
  ActiveStatus: true,
};
const TeamDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
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
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
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
    formData.append("Description", form.Description);
    formData.append("ActiveStatus", form.ActiveStatus);
    formData.append("Image", form.Image);
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
            name="Title"
            label="Title"
            id="Title"
            onChange={handleChange}
            value={form.Title === "" ? "" : form.Title}
            variant="outlined"
            size="small"
            required
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
            value={form.Description === "" ? "" : form.Description}
            variant="outlined"
            size="small"
            required
            multiline
            rows={5}
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
          <TeamUsers id={drawerID} Title={form.Title} />
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Team" : form.Title}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={form.Title == "" || form.Description == "" || form.Image == ""}
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

export default TeamDrawer;
