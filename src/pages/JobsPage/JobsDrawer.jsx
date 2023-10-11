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
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import RichTextBox from "../../components/Forms/RichTextBox";
const defaultFormState = {
  id: "",
  Location: "",
  Type: "",
  WeekHours: "",
  Expired: false,
  Author: {
    id: "",
    Name: "",
  },
  usersId: "",
  ActiveStatus: true,
};

const JobsDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [job_Translation, setJob_Translation] = useState([]);
  const sliderRef = useRef();
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
          setForm(data);
          setJob_Translation(data.Jobs_Translation);
        }
      } else {
        setForm(defaultFormState);
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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }
  function handleTranslationChange(e, item, type) {
    // if (drawerID !== "")
    setJob_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Title: type == "Title" ? e.target.value : obj.Title,
            Description: type == "Description" ? e : obj.Description,
          };
        }
        return obj;
      })
    );
  }
  useEffect(() => {
    if (addSuccess || updateSuccess || addIsError || updateIsError) {
      setForm(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess, addIsError, updateIsError]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
    setJob_Translation([]);
    setCurrentSlide();
  };
  function handleSubmit(event) {
    event.preventDefault();

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
          ActiveStatus: `${form.ActiveStatus}`,
          Location: form.Location,
          Type: form.Type,
          WeekHours: form.WeekHours,
          Expired: `${form.Expired}`,
          AuthorID: form.usersId,
          Jobs_Translation: JT,
        },
      });
    } else {
      //update
      updateJob({
        id: drawerID,
        formData: {
          ActiveStatus: `${form.ActiveStatus}`,
          Location: form.Location,
          Type: form.Type,
          WeekHours: form.WeekHours,
          Expired: `${form.Expired}`,
          Author: form.usersId,
          Jobs_Translation: JT,
        },
      });
    }
  }
  const hiddenFileInput = React.useRef(null);
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
                      value={item.Name}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </div>
                  <RichTextBox
                    label={`${item.Language.Name} Body`}
                    value={item.Description}
                    onChange={(e) =>
                      handleTranslationChange(e, item, "Description")
                    }
                  />
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
              value={form.Location}
              variant="outlined"
              size="small"
              required
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
              value={form.Type}
              variant="outlined"
              size="small"
              required
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
              value={form.WeekHours}
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
                    name="Expired"
                    value={form.Expired}
                    checked={form.Expired}
                  />
                }
                label={form.Expired ? "Expired" : "Not Expired"}
              />
            </FormGroup>
          </div>
          {usersisSuccess && (
            <div className=" flex m-4">
              <Autocomplete
                fullWidth
                disablePortal
                id="usersID"
                value={form.Author}
                onChange={(e, newValue) => {
                  setForm({ ...form, usersID: newValue.id });
                }}
                options={users.normalData}
                getOptionLabel={(option) => option.Name}
                filterOptions={createFilterOptions({
                  matchFrom: "start",
                  stringify: (option) => option.Name,
                })}
                renderInput={(params) => (
                  <TextField
                    // fullWidth
                    {...params}
                    type="text"
                    name="usersID"
                    label="Job Creator"
                    id="usersID"
                  />
                )}
              />
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
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Job" : "Edit Job"}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      // disabled={
      //   valueAr == "" ||
      //   valueEn == "" ||
      //   form.capAr == "" ||
      //   form.capEn == "" ||
      //   form.titleAr == "" ||
      //   form.titleEn == "" ||
      //   form.image == ""
      // }
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