import React, { useEffect, useState, useRef } from "react";

import {
  useAddLNGMutation,
  useLazyGetLNGByIdQuery,
  useUpdateLNGMutation,
} from "../../redux/languages/languagesSlice";
import {
  CircularProgress,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Directions } from "../../constants";
import PageModal from "../../components/Admin/layout/PageModal";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

const defaultFormState = {
  id: "",
  Name: "",
  Code: "",
  Direction: "ltr",
};
const LNGDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const {
    errors,
    handleChange,
    handleSubmit,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(submit, defaultFormState);
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
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
          setValues(data);
        }
      } else {
        setValues(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);

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
      addLNG({
        values: {
          Name: values.Name,
          Code: values.Code,
          Direction: values.Direction,
        },
      });
    } else {
      //update
      updateLNG({
        id: drawerID,
        values: {
          Name: values.Name,
          Code: values.Code,
          Direction: values.Direction,
        },
      });
    }
  }
  const formRef = useRef(null);
  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Language")
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
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Name"
            label="Name"
            id="Name"
            onChange={handleChange}
            value={values.Name === "" ? "" : values.Name}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Name)}
            helperText={errors?.Name}
            disabled={disableField}
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
            value={values.Code === "" ? "" : values.Code}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Code)}
            helperText={errors?.Code}
            disabled={disableField}
          />
        </div>
        <div className="flex m-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Content Direction*
            </InputLabel>
            <Select
              labelId="Direction"
              name="Direction"
              id="Direction"
              value={values.Direction}
              label="Content Direction"
              onChange={handleChange}
              MenuProps={{
                style: {
                  maxHeight: "400px",
                },
              }}
              disabled={disableField}
            >
              {Directions?.map((item, j) => {
                return (
                  <MenuItem key={j} value={item} className="!uppercase">
                    {item}
                    {`: ${item == "rtl" ? "RIGHT TO LEFT" : "LEFT TO RIGHT"}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </div>
    </form>
  );
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Language" : values.Name}
      newItem={drawerID == "" && true}
      editable={!disableField}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={disabled}
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
