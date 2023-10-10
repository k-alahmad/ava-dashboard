import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
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
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [address_Translation, setAddress_Translation] = useState([]);
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
          setForm(data);
          setAddress_Translation(data.Address_Translation);
          console.log(data.Address_Translation);
        }
      } else {
        setForm({ ...defaultFormState, AddressID: parentId });
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
    setAddress_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Name: type == "Name" ? e.target.value : obj.Name,
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
  };
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Latitude", form.Latitude);
    formData.append("Longitude", form.Longitude);
    form.AddressID !== "" &&
      drawerID == "" &&
      formData.append("AddressID", form.AddressID);
    formData.append("ActiveStatus", form.ActiveStatus);
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
                src={`${API_BASE_URL}/${oldImage}`}
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
            value={form.Longitude}
            variant="outlined"
            size="small"
            required
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="Latitude"
            label="Latitude"
            id="Latitude"
            onChange={handleChange}
            value={form.Latitude}
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
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Address" : "Edit Address"}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Longitude == "" ||
        form.Latitude == "" ||
        form.Latitude == "" ||
        form.Image == ""
      }
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
