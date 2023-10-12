import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddAnnouncementMutation,
  useLazyGetAnnouncementByIdQuery,
  useUpdateAnnouncementMutation,
} from "../../redux/announcements/announcementsSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Button from "../../components/UI/Button";
import { API_BASE_URL, Announcement_Type } from "../../constants";
const defaultFormState = {
  id: "",
  StartDate: "",
  EndDate: "",
  Rank: "",
  Type: "Normal",
  Link: "",
  Image: "",
  ActiveStatus: true,
  Announcements_Translation: [],
};

const AnnouncementDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [announcements_Translation, setAnnouncements_Translation] = useState(
    []
  );
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

  const [
    getAnnouncementById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetAnnouncementByIdQuery();
  const [
    addAnnouncement,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddAnnouncementMutation();
  const [
    updateAnnouncement,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateAnnouncementMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getAnnouncementById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setForm(data);
          setAnnouncements_Translation(data.Announcements_Translation);
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
              ButtonName: "",
            });
          });
          setAnnouncements_Translation(translations);
        }
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

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
  function handleTranslationChange(e, item, type) {
    setAnnouncements_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Title: type == "Title" ? e.target.value : obj.Title,
            Description:
              type == "Description" ? e.target.value : obj.Description,
            ButtonName: type == "ButtonName" ? e.target.value : obj.ButtonName,
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
    setImage(null);
    setImageURL(null);
    setOldImage(null);
    setAnnouncements_Translation([]);
    setCurrentSlide();
  };
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("ActiveStatus", form.ActiveStatus);
    formData.append("Type", form.Type);
    formData.append("Link", form.Link);
    formData.append("Rank", form.Rank);
    formData.append("StartDate", form.StartDate);
    formData.append("EndDate", form.EndDate);
    if (image) formData.append("Image", image);
    for (let i = 0; i < announcements_Translation.length; i++) {
      formData.append(
        `Announcements_Translation[${i}][Title]`,
        announcements_Translation[i].Title
      );
      formData.append(
        `Announcements_Translation[${i}][Description]`,
        announcements_Translation[i].Description
      );
      formData.append(
        `Announcements_Translation[${i}][ButtonName]`,
        announcements_Translation[i].ButtonName
      );
      formData.append(
        `Announcements_Translation[${i}][languagesID]`,
        announcements_Translation[i].languagesID
      );
    }
    if (drawerID == "") {
      //add
      addAnnouncement({ formData });
    } else {
      //update
      updateAnnouncement({ id: drawerID, formData });
    }
  }
  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);

  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
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
                <p className="text-smaller font-regular pb-1">New image</p>
                <img className="h-[200px] w-[200px] " src={imageURL} alt="" />
              </div>
            )}
            {oldImage && (
              <div className="flex flex-col m-4">
                <p className="text-smaller font-regular pb-1">Current image</p>
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
              name="Link"
              label="Link"
              id="Link"
              onChange={handleChange}
              value={form.Link}
              variant="outlined"
              size="small"
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Rank"
              label="Rank"
              id="Rank"
              onChange={handleChange}
              value={form.Rank}
              variant="outlined"
              size="small"
              required
            />
          </div>
          {Announcement_Type.length > 0 && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type*</InputLabel>
                <Select
                  labelId="Type"
                  name="Type"
                  id="Type"
                  value={form.Type}
                  label="Author"
                  onChange={handleChange}
                  MenuProps={{
                    style: {
                      maxHeight: "400px",
                    },
                  }}
                >
                  {Announcement_Type?.map((item, j) => {
                    return (
                      <MenuItem key={j} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          )}
          <div className=" m-4">
            <InputLabel id="demo-simple-select-label">Start Date*</InputLabel>
            <TextField
              fullWidth
              type="date"
              // pattern="\d{4}-\d{2}-\d{2}"
              defaultValue="2023-01-1"
              name="StartDate"
              id="StartDate"
              onChange={handleChange}
              value={form.StartDate?.split("T")[0]}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className=" m-4">
            <InputLabel id="demo-simple-select-label">End Date*</InputLabel>
            <TextField
              fullWidth
              type="date"
              name="EndDate"
              id="EndDate"
              defaultValue="2023-01-1"
              onChange={handleChange}
              value={form.EndDate?.split("T")[0]}
              variant="outlined"
              size="small"
              required
            />
          </div>

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
              {announcements_Translation.map((item, index) => {
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
            {announcements_Translation.map((item, index) => {
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
                      required={item.Language.Code == "En"}
                    />
                  </div>
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Name" + item.Language.Code}
                      label={`${item.Language.Name} Description`}
                      id={"Description" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Description")
                      }
                      value={item.Description}
                      variant="outlined"
                      size="small"
                      required={item.Language.Code == "En"}
                      multiline
                      rows={5}
                    />
                  </div>
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"ButtonName" + item.Language.Code}
                      label={`${item.Language.Name} Button Name`}
                      id={"ButtonName" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "ButtonName")
                      }
                      value={item.ButtonName}
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              );
            })}
          </Slider>

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
      title={drawerID == "" ? "New Announcement" : form.titleEn}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Rank?.toString().replace(/ /g, "") == "" ||
        (form.Type !== "Normal" && form.Type !== "Popup") ||
        form.StartDate.replace(/ /g, "") == "" ||
        form.EndDate.replace(/ /g, "") == "" ||
        announcements_Translation
          .find((x) => x.Language.Code == "En")
          ?.Title.replace(/ /g, "") == "" ||
        announcements_Translation
          .find((x) => x.Language.Code == "En")
          ?.Description.replace(/ /g, "") == "" ||
        image == undefined
      }
      alertMessage={"Required Data Are Missing"}
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

export default AnnouncementDrawer;
