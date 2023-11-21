import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddJobMutation,
  useLazyGetJobByIdQuery,
  useUpdateJobMutation,
} from "../../redux/jobs/jobsSlice";
// import {useget}
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import { useGetActiveUsersQuery } from "../../redux/users/usersSlice";
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

import RichTextBox from "../../components/Forms/RichTextBox";
import useForm from "../../hooks/useForm";
const defaultFormState = {
  id: "",
  Location: "",
  Type: "",
  WeekHours: "",
  Expired: false,
  usersID: "",
  ActiveStatus: true,
};

const JobsDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [job_Translation, setJob_Translation] = useState([]);
  const {
    errors,
    setErrors,
    values,
    setValues,
    handleChange,
    handleTranslationChange,
    handleSubmit,
    disabled,
  } = useForm(submit, defaultFormState, job_Translation, setJob_Translation);
  const sliderRef = useRef();
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  var selectSearchInput = useRef(undefined);
  const [currentSlide, setCurrentSlide] = useState();
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();
  const {
    data: users,
    isLoading: usersIsLoading,
    isFetching: usersIsFethcing,
    isSuccess: usersisSuccess,
    isError: usersIsError,
    error: usersError,
  } = useGetActiveUsersQuery();
  const [
    getJobById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetJobByIdQuery();
  const [
    addJob,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddJobMutation();
  const [
    updateJob,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateJobMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getJobById({ id: drawerID });
        if (isSuccess) {
          setValues(data);
          setJob_Translation(data.Jobs_Translation);
        }
      } else {
        setValues(defaultFormState);
        if (lngisSuccess) {
          let translations = [];
          lngs.normalData.map((item) => {
            translations.push({
              languagesID: item.id,
              Language: {
                Name: item.Name,
                Code: item.Code,
              },
              Title: "",
              Description: "",
            });
          });
          setJob_Translation(translations);
        }
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

  useEffect(() => {
    if (addSuccess || updateSuccess || addIsError || updateIsError) {
      setValues(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess, addIsError, updateIsError]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setJob_Translation([]);
    setCurrentSlide();
    setErrors({});
  };
  function submit(event) {
    let JT = [];
    for (let i = 0; i < job_Translation.length; i++) {
      JT.push({
        languagesID: job_Translation[i].languagesID,
        Title: job_Translation[i].Title,
        Description: job_Translation[i].Description,
      });
    }
    if (drawerID == "") {
      //add
      addJob({
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          Location: values.Location,
          Type: values.Type,
          WeekHours: values.WeekHours,
          Expired: `${values.Expired}`,
          AuthorID: values.usersId,
          Jobs_Translation: JT,
        },
      });
    } else {
      //update
      updateJob({
        id: drawerID,
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          Location: values.Location,
          Type: values.Type,
          WeekHours: values.WeekHours,
          Expired: `${values.Expired}`,
          Author: values.usersId,
          Jobs_Translation: JT,
        },
      });
    }
  }
  const formRef = useRef(null);

  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
          <div className="w-full flex justify-center items-center">
            <Slider
              dots={false}
              arrows={false}
              infinite={false}
              slidesToShow={lngs.normalData.length ?? 4}
              slidesToScroll={1}
              className="overflow-hidden h-full w-full max-w-[1024px]"
              initialSlide={currentSlide}
            >
              {job_Translation.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`max-w-[95%] py-1 px-2 text-center font-semibold ${
                      currentSlide == item.Language.Code
                        ? "bg-primary text-secondary"
                        : "bg-secondary text-white"
                    } cursor-pointer transition-all duration-500 text-black rounded-md`}
                    onClick={() => {
                      sliderRef.current.slickGoTo(index);
                      setCurrentSlide(item.Language.Code);
                    }}
                  >
                    {item.Language.Name}
                  </div>
                );
              })}
            </Slider>
          </div>
          <Slider
            ref={sliderRef}
            dots={false}
            touchMove={false}
            swipe={false}
            arrows={false}
            initialSlide={currentSlide}
            infinite={false}
            className="overflow-hidden h-full w-full"
          >
            {job_Translation.map((item, index) => {
              return (
                <div key={index} className="pb-12">
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Title" + item.Language.Code}
                      label={`${item.Language.Name} Title`}
                      id={"Title" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Title")
                      }
                      value={item.Title}
                      variant="outlined"
                      size="small"
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Title" + item.Language.Code
                        )
                      )}
                      helperText={
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Title" + item.Language.Code
                          )
                        ]
                      }
                    />
                  </div>
                  <RichTextBox
                    label={`${item.Language.Name} Body ${
                      item.Language.Code == "En" ? "*" : ""
                    }`}
                    value={item.Description}
                    error={Boolean(
                      Object.keys(errors).find(
                        (x) => x == "Title" + item.Language.Code
                      )
                    )}
                    onChange={(e) =>
                      handleTranslationChange(e, item, "Description", true)
                    }
                  />
                  <p className="text-[14px] text-red-600 px-10">
                    {
                      errors[
                        Object.keys(errors).find(
                          (x) => x == "Description" + item.Language.Code
                        )
                      ]
                    }
                  </p>
                </div>
              );
            })}
          </Slider>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="Location"
              label={`Location`}
              id="Location"
              onChange={handleChange}
              value={values.Location}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.Location)}
              helperText={errors?.Location}
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="Type"
              label={`Type`}
              id="Type"
              onChange={handleChange}
              value={values.Type}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.Type)}
              helperText={errors?.Type}
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="WeekHours"
              label={`WeekHours`}
              id="WeekHours"
              onChange={handleChange}
              value={values.WeekHours}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.WeekHours)}
              helperText={errors?.WeekHours}
            />
          </div>
          <div className="flex m-4">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleChange}
                    name="Expired"
                    value={values.Expired}
                    checked={values.Expired}
                  />
                }
                label={values.Expired ? "Expired" : "Not Expired"}
              />
            </FormGroup>
          </div>

          {usersisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Job Creator*
                </InputLabel>
                <Select
                  labelId="usersId"
                  name="usersID"
                  id="usersID"
                  value={values.usersID}
                  label="Job Creator"
                  onChange={handleChange}
                  MenuProps={{
                    autoFocus: false,
                    style: {
                      maxHeight: "400px",
                    },
                  }}
                  onClose={() => setSelectSearchTerm("")}
                  // renderValue={() => values.roleID}
                  onAnimationEnd={() => selectSearchInput.current?.focus()}
                  error={Boolean(errors?.usersID)}
                >
                  <ListSubheader>
                    <TextField
                      ref={selectSearchInput}
                      fullWidth
                      type="text"
                      name="SelectSearchTerm"
                      placeholder="Search for Job Creator"
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

                  {users.ids?.map((item, j) => {
                    if (
                      users?.entities[item]?.Name.toLowerCase().includes(
                        selectSearchTerm.toLowerCase()
                      )
                    )
                      return (
                        <MenuItem key={j} value={item}>
                          {users.entities[item].Name}
                        </MenuItem>
                      );
                  })}
                </Select>
                <p className="text-[14px] text-red-600 ml-5">
                  {errors.usersID}
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
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Job" : "Edit Job"}
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
        lngIsLoading ||
        lngIsFethcing ? (
          <div className="flex flex-row justify-center items-center h-full w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="text-med font-LIT">{formElements()}</div>
        )
      }
    />
  );
};

export default JobsDrawer;
