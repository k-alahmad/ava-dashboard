import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";

import {
  useAddLNGMutation,
  useLazyGetLNGByIdQuery,
  useUpdateLNGMutation,
} from "../../redux/languages/languagesSlice";
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

const defaultFormState = {
  id: "",
  Name: "",
  Code: "",
};
const LNGDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [
    getLNGById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetLNGByIdQuery();
  const [addLNG, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddLNGMutation();
  const [updateLNG, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateLNGMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getLNGById({ id: drawerID });
        if (isSuccess) {
          setForm(data);
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
      addLNG({
        form: {
          Name: form.Name,
          Code: form.Code,
        },
      });
    } else {
      //update
      updateLNG({
        id: drawerID,
        form: {
          Name: form.Name,
          Code: form.Code,
        },
      });
    }
  }
  const formRef = useRef(null);

  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-center">
      <div className="py-8 mx-12">
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
            name="Code"
            label="Code"
            id="Code"
            onChange={handleChange}
            value={form.Code === "" ? "" : form.Code}
            variant="outlined"
            size="small"
            required
          />
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Language" : form.Name}
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

export default LNGDrawer;