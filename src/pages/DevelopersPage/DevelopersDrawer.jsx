import React, { useEffect, useState, useRef } from "react";
import {
  useAddDeveloperMutation,
  useLazyGetDeveloperByIdQuery,
  useUpdateDeveloperMutation,
} from "../../redux/developers/developersSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Button from "../../components/UI/Button";
import { API_BASE_URL } from "../../constants";
import PageModal from "../../components/Admin/layout/PageModal";
import useForm from "../../hooks/useForm";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
const defaultFormState = {
  id: "",
  ViewTag: false,
  Image: "",
  ActiveStatus: true,
};

const DeveloperDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [developers_Translation, setDevelopers_Translation] = useState([]);
  const {
    errors,
    handleChange,
    handleSubmit,
    handleTranslationChange,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(
    submit,
    defaultFormState,
    developers_Translation,
    setDevelopers_Translation
  );
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
  const dispatch = useDispatch();
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();

  const [
    getDeveloperById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetDeveloperByIdQuery();
  const [
    addDeveloper,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddDeveloperMutation();
  const [
    updateDeveloper,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateDeveloperMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getDeveloperById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setValues(data);
          setDevelopers_Translation(data.Developer_Translation);
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
              Name: "",
            });
          });
          setDevelopers_Translation(translations);
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
    setValues({ ...values, Image: e.target.files[0] });
  }

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
    setImage(null);
    setImageURL(null);
    setOldImage(null);
    setDevelopers_Translation([]);
    setCurrentSlide();
    setErrors({});
  };
  function submit(event) {
    const formData = new FormData();
    formData.append("ActiveStatus", values.ActiveStatus);
    formData.append("ViewTag", values.ViewTag);
    if (image) formData.append("Image", image);
    for (let i = 0; i < developers_Translation.length; i++) {
      formData.append(
        `Developer_Translation[${i}][Name]`,
        developers_Translation[i].Name
      );
      formData.append(
        `Developer_Translation[${i}][languagesID]`,
        developers_Translation[i].languagesID
      );
    }
    if (drawerID == "") {
      //add
      addDeveloper({ formData });
    } else {
      //update
      updateDeveloper({ id: drawerID, formData });
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
                  src={API_BASE_URL + oldImage}
                  alt=""
                />
              </div>
            )}
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
              {developers_Translation.map((item, index) => {
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
            {developers_Translation.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Name" + item.Language.Code}
                      label={`${item.Language.Name} Name`}
                      id={"Name" + item.Language.Code}
                      onChange={(e) => handleTranslationChange(e, item, "Name")}
                      value={item.Name}
                      variant="outlined"
                      size="small"
                      required
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Name" + item.Language.Code
                        )
                      )}
                      helperText={
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Name" + item.Language.Code
                          )
                        ]
                      }
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
                    name="ViewTag"
                    value={values.ViewTag}
                    checked={values.ViewTag}
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
    <PageModal
      isOpen={drawerOpen}
      title={
        drawerID == ""
          ? "New Developer"
          : developers_Translation.find((x) => x.Language.Code == "En")?.Name
      }
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

export default DeveloperDrawer;
