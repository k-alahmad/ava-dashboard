import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddAmenityMutation,
  useLazyGetAmenityByIdQuery,
  useUpdateAmenityMutation,
} from "../../redux/amentities/amenitiesSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import { CircularProgress, TextField } from "@mui/material";
import Button from "../../components/UI/Button";
import { API_BASE_URL } from "../../constants";
import PageModal from "../../components/Admin/layout/PageModal";
const defaultFormState = {
  id: "",
  Image: "",
};

const AmenityDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [amenities_Translation, setAmenities_Translation] = useState([]);
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
    getAmenityById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetAmenityByIdQuery();
  const [
    addAmenity,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddAmenityMutation();
  const [
    updateAmenity,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateAmenityMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getAmenityById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setForm(data);
          setAmenities_Translation(data.Aminities_Translation);
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
              Name: "",
              Description: "",
            });
          });
          setAmenities_Translation(translations);
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
    setAmenities_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Name: type == "Name" ? e.target.value : obj.Name,
            Description:
              type == "Description" ? e.target.value : obj.Description,
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
    setAmenities_Translation([]);
    setCurrentSlide();
  };
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    if (image) formData.append("Image", image);
    for (let i = 0; i < amenities_Translation.length; i++) {
      formData.append(
        `Aminities_Translation[${i}][Name]`,
        amenities_Translation[i].Name
      );
      formData.append(
        `Aminities_Translation[${i}][Description]`,
        amenities_Translation[i].Description
      );
      formData.append(
        `Aminities_Translation[${i}][languagesID]`,
        amenities_Translation[i].languagesID
      );
    }
    if (drawerID == "") {
      //add
      addAmenity({ formData });
    } else {
      //update
      updateAmenity({ id: drawerID, formData });
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
              {amenities_Translation.map((item, index) => {
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
            {amenities_Translation.map((item, index) => {
              return (
                <div key={index} className="pb-12">
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
                    />
                  </div>
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Description" + item.Language.Code}
                      label={`${item.Language.Name} Description`}
                      id={"Description" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Description")
                      }
                      value={item.Description}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </form>
    );
  };
  return (
    <PageModal
      isOpen={drawerOpen}
      title={
        drawerID == ""
          ? "New Amenity"
          : amenities_Translation.find((x) => x.Language.Code == "En")?.Name
      }
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        amenities_Translation
          .find((x) => x.Language.Code == "En")
          ?.Name.replace(/ /g, "") == "" ||
        amenities_Translation
          .find((x) => x.Language.Code == "En")
          ?.Description.replace(/ /g, "") == "" ||
        (drawerID == "" && image == undefined)
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

export default AmenityDrawer;
