import React, { useEffect, useState, useRef } from "react";
import {
  useAddAddressMutation,
  useLazyGetAddressByIdQuery,
  useUpdateAddressMutation,
} from "../../redux/addresses/addressesSlice";
import Button from "../../components/UI/Button";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import Slider from "react-slick";
import { API_BASE_URL } from "../../constants";
import { showMessage } from "../../redux/messageAction.slice";
import { useDispatch } from "react-redux";
import PageModal from "../../components/Admin/layout/PageModal";
import useForm from "../../hooks/useForm";
const defaultFormState = {
  id: "",
  Image: "",
  Longitude: "",
  Latitude: "",
  Address_Translation: [],
  AddressID: null,
  ActiveStatus: true,
};
const AddressDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
  parentId,
  parentName,
}) => {
  const [address_Translation, setAddress_Translation] = useState([]);
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
    address_Translation,
    setAddress_Translation
  );
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
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
    getAddressById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetAddressByIdQuery();
  const [
    addAddress,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddAddressMutation();
  const [
    updateAddress,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateAddressMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) {
      dispatch(
        showMessage({
          message: error,
          variant: "error",
        })
      );
    }
  }, [isError]);

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getAddressById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setValues(data);
          setAddress_Translation(data.Address_Translation);
          console.log(data.Address_Translation);
        }
      } else {
        setValues({ ...defaultFormState, AddressID: parentId });
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
          setAddress_Translation(translations);
        }
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
    setErrors({});
  };
  function submit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Latitude", values.Latitude);
    formData.append("Longitude", values.Longitude);
    values.AddressID !== "" &&
      drawerID == "" &&
      formData.append("AddressID", values.AddressID);
    formData.append("ActiveStatus", values.ActiveStatus);
    if (image) formData.append("Image", image);
    for (let i = 0; i < address_Translation.length; i++) {
      formData.append(
        `Address_Translation[${i}][Name]`,
        address_Translation[i].Name
      );
      formData.append(
        `Address_Translation[${i}][languagesID]`,
        address_Translation[i].languagesID
      );
    }
    if (drawerID == "") {
      //add
      addAddress({ formData });
    } else {
      //update
      updateAddress({
        id: drawerID,
        formData,
      });
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
        <div className="flex m-4">
          <TextField
            fullWidth
            type="number"
            name="Longitude"
            label="Longitude"
            id="Longitude"
            onChange={handleChange}
            value={values.Longitude}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Longitude)}
            helperText={errors?.Longitude}
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="number"
            name="Latitude"
            label="Latitude"
            id="Latitude"
            onChange={handleChange}
            value={values.Latitude}
            variant="outlined"
            size="small"
            required
            error={Boolean(errors?.Latitude)}
            helperText={errors?.Latitude}
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
            {address_Translation.map((item, index) => {
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
          {address_Translation.map((item, index) => {
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
    <PageModal
      isOpen={drawerOpen}
      title={
        drawerID == ""
          ? parentName
            ? `Sub-Address for ${parentName}`
            : "New Address"
          : "Edit Address"
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
          <div className="text-med font-light">{formElements()}</div>
        )
      }
    />
  );
};

export default AddressDrawer;
