import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddPropertyMutation,
  useLazyGetPropertyByIdQuery,
  useUpdatePropertyMutation,
} from "../../redux/properties/propertiesSlice";
import { useGetActiveCategoryQuery } from "../../redux/categories/categoriesSlice";
import { useGetActiveDevelopersQuery } from "../../redux/developers/developersSlice";
import { useGetActiveAddressQuery } from "../../redux/addresses/addressesSlice";
import { useGetAmenitiesQuery } from "../../redux/amentities/amenitiesSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
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
  Chip,
  OutlinedInput,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from "../../components/UI/Button";
import {
  API_BASE_URL,
  CompletionStatus,
  FurnishingStatus,
  VacantStatus,
} from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import {
  useDeleteAllPropertyImagesMutation,
  useDeleteImageMutation,
} from "../../redux/images/imagesSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import useForm from "../../hooks/useForm";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import PropertyBuyPDF from "./PropertyBuyPDF";
import { PDFViewer } from "@react-pdf/renderer";
const defaultFormState = {
  id: "",
  CompletionStatus: "Ready",
  FurnishingStatus: "Furnished",
  VacantStatus: "No",
  Longitude: 55.26969018195244,
  Latitude: 25.188872617717333,
  Handover: "",
  ReraNo: "",
  // BRNNo: "",
  Images: "",
  MetaData: "",
  DeveloperID: "",
  CategoryID: "",
  AddressID: "",
  // size: "",
  ActiveStatus: true,
  Aminities: [],
  propertyUnits: [],
};

const PropertyBuyDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [properties_Translation, setProperties_Translation] = useState([]);
  const [units, setUnits] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState({});
  const [defaultLatLng, setDefaultLatLng] = useState({
    lat: 25.188872617717333,
    lng: 55.26969018195244,
  });
  const {
    disabled,
    setErrors,
    errors,
    setValues,
    values,
    handleChange,
    handleSubmit,
    handleTranslationChange,
    handleUnitsChange,
  } = useForm(
    submit,
    defaultFormState,
    properties_Translation,
    setProperties_Translation,
    units,
    setUnits
  );
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState([]);
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  const dispatch = useDispatch();
  var selectSearchInput = useRef(undefined);
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();
  const {
    data: addresses,
    isLoading: addressesIsLoading,
    isFetching: addressesIsFethcing,
    isSuccess: addressesisSuccess,
    isError: addressesIsError,
    error: addressesError,
  } = useGetActiveAddressQuery();
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isFetching: categoriesIsFethcing,
    isSuccess: categoriesisSuccess,
    isError: categoriesIsError,
    error: categoriesError,
  } = useGetActiveCategoryQuery();
  const {
    data: developers,
    isLoading: developersIsLoading,
    isFetching: developersIsFethcing,
    isSuccess: developersisSuccess,
    isError: developersIsError,
    error: developersError,
  } = useGetActiveDevelopersQuery();
  const {
    data: amenities,
    isLoading: amenitiesIsLoading,
    isFetching: amenitiesIsFethcing,
    isSuccess: amenitiesisSuccess,
    isError: amenitiesIsError,
    error: amenitiesError,
  } = useGetAmenitiesQuery();
  const [
    getPropertyById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetPropertyByIdQuery();
  const [
    addProperty,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddPropertyMutation();
  const [
    updateProperty,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdatePropertyMutation();
  const [
    deleteallPropertyImages,
    {
      isLoading: deleteAllImagesIsLoading,
      isSuccess: deleteAllImagesIsSuccess,
    },
  ] = useDeleteAllPropertyImagesMutation();
  const [
    deleteImage,
    {
      isLoading: deleteSingleImageIsLoading,
      isSuccess: deleteSingleImageIsSuccess,
    },
  ] = useDeleteImageMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getPropertyById({ id: drawerID });
        if (isSuccess) {
          let loadedAmenities = [];
          data.Aminities.map((item) => {
            loadedAmenities.push(item.id);
          });
          setValues({
            ...data,
            Bacloney: data.Bacloney,
            DeveloperID: data.developerId,
            AddressID: data.addressId,
            CategoryID: data.categoryId,
            Aminities: loadedAmenities,
            propertyUnits: data.propertyUnits,
          });
          setProperties_Translation(data.Property_Translation);
          setUnits(data.propertyUnits);
          setPaymentPlan(data.propertyUnits[0]?.Paymentplan[0] ?? []);
          setDefaultLatLng({
            lat: data.Latitude,
            lng: data.Longitude,
          });
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
              Description: "",
            });
          });
          setProperties_Translation(translations);
        }
        let pUnits = [];
        pUnits.push({
          Bacloney: false,
          BalconySize: "",
          Bathrooms: "",
          Bedrooms: "",
          DEDNo: "",
          PermitNumber: "",
          Price: "",
          PricePerSQFT: "",
          Size: "",
        });

        setUnits(pUnits);
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

  const newImageUrls = [];
  useEffect(() => {
    if (image.length < 1) return;
    image.forEach((img) => newImageUrls.push(URL.createObjectURL(img)));
    setImageURL(newImageUrls);
  }, [image]);
  function onImageChange(e) {
    setImage([...image, ...e.target.files]);
  }

  useEffect(() => {
    if (addSuccess || updateSuccess || addIsError || updateIsError) {
      setValues(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess, addIsError, updateIsError]);

  useEffect(() => {
    if (deleteAllImagesIsSuccess || deleteSingleImageIsSuccess)
      getPropertyById({ id: drawerID });
  }, [deleteAllImagesIsSuccess, deleteSingleImageIsSuccess]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setImage([]);
    setImageURL([]);
    setOldImage(null);
    setProperties_Translation([]);
    setCurrentSlide(0);
    setErrors({});
    setUnits([]);
  };
  function submit(event) {
    // event.preventDefault();
    const formData = new FormData();

    formData.append("Handover", values.Handover);
    formData.append("FurnishingStatus", values.FurnishingStatus);
    formData.append("CompletionStatus", values.CompletionStatus);
    formData.append("VacantStatus", values.VacantStatus);
    formData.append("Longitude", defaultLatLng.lng);
    formData.append("Latitude", defaultLatLng.lat);
    formData.append("Purpose", "Buy");
    formData.append("RentMin", "0");
    formData.append("ReraNo", values.ReraNo);
    // formData.append("BRNNo", values.BRNNo);
    formData.append("DeveloperID", values.DeveloperID);
    formData.append("CategoryID", values.CategoryID);
    formData.append("AddressID", values.AddressID);
    formData.append("ActiveStatus", values.ActiveStatus);

    if (values.Aminities) {
      for (let i = 0; i < values.Aminities.length; i++) {
        formData.append("Aminities", values.Aminities[i]);
      }
    }
    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("Images", image[i]);
      }
    }
    for (let i = 0; i < properties_Translation.length; i++) {
      formData.append(
        `Property_Translation[${i}][Name]`,
        properties_Translation[i].Name
      );
      formData.append(
        `Property_Translation[${i}][Description]`,
        properties_Translation[i].Description
      );
      formData.append(
        `Property_Translation[${i}][languagesID]`,
        properties_Translation[i].languagesID
      );
    }
    for (let i = 0; i < units.length; i++) {
      drawerID !== "" &&
        formData.append(`propertyUnits[${i}][id]`, units[i].id);
      formData.append(`propertyUnits[${i}][Bacloney]`, units[i].Bacloney);
      formData.append(`propertyUnits[${i}][BalconySize]`, units[i].BalconySize);
      formData.append(`propertyUnits[${i}][Bathrooms]`, units[i].Bathrooms);
      formData.append(`propertyUnits[${i}][Bedrooms]`, units[i].Bedrooms);
      formData.append(`propertyUnits[${i}][DEDNo]`, units[i].DEDNo);
      formData.append(
        `propertyUnits[${i}][EstimatedRent]`,
        units[i].EstimatedRent
      );
      formData.append(
        `propertyUnits[${i}][PermitNumber]`,
        units[i].PermitNumber
      );
      formData.append(`propertyUnits[${i}][Price]`, units[i].Price);
      formData.append(
        `propertyUnits[${i}][PricePerSQFT]`,
        parseFloat(units[i].Price / units[i].Size).toFixed(3)
      );
      formData.append(`propertyUnits[${i}][Size]`, units[i].Size);
    }

    if (drawerID == "") {
      //add
      addProperty({ formData });
    } else {
      //update
      updateProperty({ id: drawerID, formData });
    }
  }

  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    sliderRef.current?.slickGoTo(currentSlide);
  }, [isSuccess, properties_Translation, sliderRef]);

  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Property")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile, drawerID]);

  const formElements = () => {
    return (
      <form ref={formRef} className="">
        <div className="flex flex-col items-center justify-start mx-8">
          {!disableField && (
            <div className="flex flex-col m-4">
              <Button
                textColor={"white"}
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
                accept="image/png, image/jpeg, image/jpg"
                multiple
                name="images"
                onChange={onImageChange}
                style={{ display: "none" }}
                ref={hiddenFileInput}
              />
            </div>
          )}
          {imageURL.length !== 0 && (
            <div className=" bg-secondary/10 backdrop-blur-[21px] rounded-lg shadow-lg p-4 space-y-4 w-full">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">New Images</p>
                <button
                  disabled={disableField}
                  onClick={() => {
                    setImage([]);
                    setImageURL([]);
                  }}
                  className="disabled:bg-gray-500 disabled:opacity-50 text-center cursor-pointer flex items-center gap-x-2 bg-primary rounded-lg p-1"
                >
                  <DeleteSweepOutlinedIcon fontSize="large" color="error" />
                  <p className="text-red-600">Delete All</p>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 max-h-[640px] overflow-y-scroll place-items-center">
                {imageURL?.map((imageSrc, i) => {
                  return (
                    <div className="relative" key={i}>
                      <img
                        key={i}
                        className="h-[300px] w-[400px] col-span-1 rounded-md"
                        src={imageSrc}
                        alt=""
                      />
                      <button
                        disabled={disableField}
                        className="disabled:bg-gray-500 disabled:opacity-50 text-center cursor-pointer absolute left-0 top-0 bg-primary rounded-br-lg rounded-tl-md pb-1 shadow-lg"
                        onClick={() => {
                          let tempUrls = imageURL;
                          let newTempUrls = tempUrls.filter(
                            (img) => img !== imageSrc
                          );
                          let idx = tempUrls.indexOf(imageSrc);
                          let tempImages = image;
                          setImageURL(newTempUrls);
                          if (idx > -1) {
                            tempImages.splice(idx, 1);
                            setImage(tempImages);
                          }
                        }}
                      >
                        <DeleteOutlinedIcon fontSize="large" color="error" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {values.Images?.length !== 0 && !isLoading && (
            <div className="bg-secondary/10 rounded-lg shadow-lg p-4 space-y-4 mt-8 w-full">
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold">Current Images</p>
                <div
                  onClick={() => {
                    deleteallPropertyImages({ id: drawerID });
                  }}
                  className="text-center cursor-pointer flex items-center gap-x-2 bg-primary rounded-lg p-1"
                >
                  <DeleteSweepOutlinedIcon fontSize="large" color="error" />
                  <p className="text-red-600">Delete All</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 max-h-[640px] overflow-y-scroll place-items-center">
                {data.Images?.map((item, index) => (
                  <div className="relative" key={index}>
                    <img
                      key={index}
                      className="col-span-1 h-[300px] w-[400px] rounded-md"
                      src={API_BASE_URL + item?.URL}
                    />
                    <div
                      onClick={() => {
                        deleteImage({ id: item.id });
                      }}
                      className="text-center cursor-pointer absolute left-0 top-0 bg-primary rounded-br-lg rounded-tl-md pb-1 shadow-lg"
                    >
                      <DeleteOutlinedIcon fontSize="large" color="error" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="py-1 mx-8">
          <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
            <p className="font-bold tex-2xl m-4">Property Details</p>
            <div className="w-full flex justify-center items-center">
              <Slider
                accessibility={false}
                dots={false}
                arrows={true}
                infinite={false}
                slidesToShow={lngs.normalData.length ?? 4}
                slidesToScroll={1}
                className="overflow-hidden h-full w-full max-w-[1024px]"
                initialSlide={currentSlide}
              >
                {properties_Translation.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`max-w-[95%] py-1 px-2 text-center font-semibold ${
                        currentSlide == index
                          ? "bg-primary text-secondary"
                          : "bg-secondary text-white"
                      } cursor-pointer transition-all duration-500 text-black rounded-md`}
                      onClick={() => {
                        sliderRef.current.slickGoTo(index);
                        setCurrentSlide(index);
                      }}
                    >
                      {item.Language.Name}
                    </div>
                  );
                })}
              </Slider>
            </div>
            <Slider
              accessibility={false}
              ref={sliderRef}
              dots={false}
              touchMove={false}
              swipe={false}
              arrows={false}
              initialSlide={currentSlide}
              infinite={false}
              className="overflow-hidden h-full w-full col-span-full"
              beforeChange={(prev, next) => setCurrentSlide(next)}
            >
              {properties_Translation.map((item, index) => {
                return (
                  <div key={index} className="pb-12">
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="text"
                        name={"Name" + item.Language.Code}
                        label={`${item.Language.Name} Title`}
                        id={"Name" + item.Language.Code}
                        onChange={(e) =>
                          handleTranslationChange(e, item, "Name")
                        }
                        value={item.Name}
                        variant="outlined"
                        size="medium"
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
                        disabled={disableField}
                      />
                    </div>
                    <div>
                      <RichTextBox
                        label={`${item.Language.Name} Description`}
                        value={item.Description}
                        disabled={disableField}
                        error={Boolean(
                          Object.keys(errors).find(
                            (x) => x == "Description" + item.Language.Code
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
                  </div>
                );
              })}
            </Slider>
            <div className="grid grid-cols-2">
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="text"
                  name="unitsCount"
                  label={`Units Count`}
                  id="unitsCount"
                  value={units.length}
                  variant="outlined"
                  size="medium"
                  disabled
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="text"
                  name="Handover"
                  label={`Handover`}
                  id="Handover"
                  onChange={handleChange}
                  value={values.Handover}
                  variant="outlined"
                  size="medium"
                  error={Boolean(errors?.Handover)}
                  helperText={errors?.Handover}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Furnishing Status
                  </InputLabel>
                  <Select
                    labelId="FurnishingStatus"
                    name="FurnishingStatus"
                    id="FurnishingStatus"
                    value={values.FurnishingStatus}
                    label="Furnishing Status"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={disableField}
                  >
                    {FurnishingStatus?.map((item, j) => {
                      return (
                        <MenuItem key={j} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>

              {developersisSuccess && (
                <div className="flex m-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Developer
                    </InputLabel>
                    <Select
                      labelId="DeveloperID"
                      name="DeveloperID"
                      id="DeveloperID"
                      value={values.DeveloperID}
                      label="Developer"
                      onChange={handleChange}
                      MenuProps={{
                        autoFocus: false,
                        style: {
                          maxHeight: "400px",
                        },
                      }}
                      onClose={() => setSelectSearchTerm("")}
                      onAnimationEnd={() => selectSearchInput.current?.focus()}
                      error={Boolean(errors?.DeveloperID)}
                      disabled={disableField}
                    >
                      <ListSubheader>
                        <TextField
                          ref={selectSearchInput}
                          fullWidth
                          type="text"
                          name="SelectSearchTerm"
                          placeholder="Search for Developer"
                          id="SelectSearchTerm"
                          onChange={(e) => setSelectSearchTerm(e.target.value)}
                          value={selectSearchTerm}
                          variant="outlined"
                          size="medium"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
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

                      {developers.ids?.map((item, j) => {
                        if (
                          developers?.entities[
                            item
                          ]?.Developer_Translation.find(
                            (x) => x.Language.Code == "En"
                          )
                            ?.Name.toLowerCase()
                            .includes(selectSearchTerm.toLowerCase())
                        )
                          return (
                            <MenuItem key={j} value={item}>
                              {
                                developers.entities[
                                  item
                                ]?.Developer_Translation.find(
                                  (x) => x.Language.Code == "En"
                                )?.Name
                              }
                            </MenuItem>
                          );
                      })}
                    </Select>
                    <p className="text-[14px] text-red-600 ml-5">
                      {errors.DeveloperID}
                    </p>
                  </FormControl>
                </div>
              )}

              {amenitiesisSuccess && (
                <div className="flex m-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Amenities
                    </InputLabel>
                    <Select
                      labelId="Aminities"
                      name="Aminities"
                      id="Aminities"
                      value={values.Aminities}
                      label="Amenities"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          Aminities:
                            typeof e.target.value === "string"
                              ? e.target.value.split(",")
                              : e.target.value,
                        })
                      }
                      MenuProps={{
                        autoFocus: false,
                        style: {
                          maxHeight: "400px",
                        },
                      }}
                      onClose={() => setSelectSearchTerm("")}
                      onAnimationEnd={() => selectSearchInput.current?.focus()}
                      error={Boolean(errors?.Aminities)}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                      }
                      multiple
                      renderValue={(selected) => (
                        <div className="flex flex-wrap gap-4">
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={
                                amenities.entities[
                                  value
                                ].Aminities_Translation.find(
                                  (x) => x.Language.Code == "En"
                                )?.Name
                              }
                            />
                          ))}
                        </div>
                      )}
                      disabled={disableField}
                    >
                      <ListSubheader>
                        <TextField
                          ref={selectSearchInput}
                          fullWidth
                          type="text"
                          name="SelectSearchTerm"
                          placeholder="Search for Developer"
                          id="SelectSearchTerm"
                          onChange={(e) => setSelectSearchTerm(e.target.value)}
                          value={selectSearchTerm}
                          variant="outlined"
                          size="medium"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
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

                      {amenities.ids?.map((item, j) => {
                        if (
                          amenities?.entities[item]?.Aminities_Translation.find(
                            (x) => x.Language.Code == "En"
                          )
                            ?.Name.toLowerCase()
                            .includes(selectSearchTerm.toLowerCase())
                        )
                          return (
                            <MenuItem key={j} value={item}>
                              {
                                amenities.entities[
                                  item
                                ]?.Aminities_Translation.find(
                                  (x) => x.Language.Code == "En"
                                )?.Name
                              }
                            </MenuItem>
                          );
                      })}
                    </Select>
                    <p className="text-[14px] text-red-600 ml-5">
                      {errors.Aminities}
                    </p>
                  </FormControl>
                </div>
              )}
              {categoriesisSuccess && (
                <div className="flex m-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="CategoryID"
                      name="CategoryID"
                      id="CategoryID"
                      value={values.CategoryID}
                      label="Category"
                      onChange={handleChange}
                      MenuProps={{
                        autoFocus: false,
                        style: {
                          maxHeight: "400px",
                        },
                      }}
                      onClose={() => setSelectSearchTerm("")}
                      onAnimationEnd={() => selectSearchInput.current?.focus()}
                      error={Boolean(errors?.CategoryID)}
                      disabled={disableField}
                    >
                      <ListSubheader>
                        <TextField
                          ref={selectSearchInput}
                          fullWidth
                          type="text"
                          name="SelectSearchTerm"
                          placeholder="Search for Category"
                          id="SelectSearchTerm"
                          onChange={(e) => setSelectSearchTerm(e.target.value)}
                          value={selectSearchTerm}
                          variant="outlined"
                          size="medium"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
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

                      {categories.allNested.ids?.map((item, j) => {
                        if (
                          categories?.allNested.entities[
                            item
                          ]?.Category_Translation.find(
                            (x) => x.Language.Code == "En"
                          )
                            ?.Name.toLowerCase()
                            .includes(selectSearchTerm.toLowerCase())
                        )
                          return (
                            <MenuItem key={j} value={item}>
                              {
                                categories.allNested.entities[
                                  item
                                ]?.Category_Translation.find(
                                  (x) => x.Language.Code == "En"
                                )?.Name
                              }
                            </MenuItem>
                          );
                      })}
                    </Select>
                    <p className="text-[14px] text-red-600 ml-5">
                      {errors.CategoryID}
                    </p>
                  </FormControl>
                </div>
              )}
              <div className="flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Completion Status
                  </InputLabel>
                  <Select
                    labelId="CompletionStatus"
                    name="CompletionStatus"
                    id="CompletionStatus"
                    value={values.CompletionStatus}
                    label="Completion Status"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={disableField}
                  >
                    {CompletionStatus?.map((item, j) => {
                      return (
                        <MenuItem key={j} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div
                className={`flex m-4 ${
                  values.CompletionStatus == "Ready" ? "scale-100" : "scale-0"
                }`}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Vacant Status
                  </InputLabel>
                  <Select
                    labelId="VacantStatus"
                    name="VacantStatus"
                    id="VacantStatus"
                    value={values.VacantStatus}
                    label="Vacant Status"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={disableField}
                  >
                    {VacantStatus?.map((item, j) => {
                      return (
                        <MenuItem key={j} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              disabled={disableField}
              onClick={(e) => {
                e.preventDefault();
                setUnits([
                  ...units,
                  {
                    Bacloney: false,
                    BalconySize: "",
                    Bathrooms: "",
                    Bedrooms: "",
                    DEDNo: "",
                    PermitNumber: "",
                    Price: "",
                    PricePerSQFT: "",
                    Size: "",
                  },
                ]);
              }}
              className="absolute disabled:bg-gray-600 disabled:opacity-50 bottom-5 right-5 rounded-lg bg-primary p-2 shadow-lg flex items-center  !cursor-pointer z-10"
            >
              <Add fontSize="large" />
              <p className="text-small">Add Unit</p>
            </button>
            {units.map((item, index) => {
              return (
                <div
                  className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg relative transition-all duration-700  animate-slideIn"
                  key={index}
                  // style={{ "--delay": index * 0.25 + "s" }}
                  style={{ "--delay": "0.000001s" }}
                >
                  <button
                    disabled={disableField}
                    onClick={(e) => {
                      e.preventDefault();
                      if (units.length > 1) {
                        let tempUnits = [...units];
                        let idx = tempUnits.indexOf(item);
                        if (idx > -1) {
                          tempUnits.splice(idx, 1);
                          setUnits(tempUnits);
                        }
                      } else {
                        dispatch(
                          showMessage({
                            message: "At Least One Unit Must Exist",
                            variant: "error",
                          })
                        );
                      }
                    }}
                    className="absolute disabled:bg-gray-600 disabled:opacity-50 top-5 right-5 rounded-lg bg-primary p-2 shadow-lg flex items-center cursor-pointer"
                  >
                    <Delete fontSize="large" color="error" />
                    <p className="text-small text-red-600">Delete Unit</p>
                  </button>
                  <p className="font-bold tex-2xl m-4">
                    Unit Details {index + 1}
                  </p>
                  <div className="grid grid-cols-2">
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"Bathrooms"}
                        label={`Bathrooms`}
                        id={"Bathrooms"}
                        onChange={(e) => {
                          handleUnitsChange(e, "Bathrooms", index);
                        }}
                        value={item.Bathrooms}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.Bathrooms)}
                        helperText={errors?.Bathrooms}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"DEDNo"}
                        label={`DEDNo`}
                        id={"DEDNo"}
                        onChange={(e) => {
                          handleUnitsChange(e, "DEDNo", index);
                        }}
                        value={item.DEDNo}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.DEDNo)}
                        helperText={errors?.DEDNo}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"PermitNumber" + index}
                        label={`Permit Number`}
                        id={"PermitNumber" + index}
                        onChange={(e) => {
                          handleUnitsChange(e, "PermitNumber", index);
                        }}
                        value={item.PermitNumber}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.PermitNumber)}
                        helperText={errors?.PermitNumber}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"Price"}
                        label={`Price`}
                        id={"Price"}
                        onChange={(e) => {
                          handleUnitsChange(e, "Price", index);
                        }}
                        value={item.Price}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.Price)}
                        helperText={errors?.Price}
                        disabled={disableField}
                      />
                    </div>

                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"Size"}
                        label={`Size`}
                        id={"Size"}
                        onChange={(e) => {
                          handleUnitsChange(e, "Size", index);
                        }}
                        value={item.Size}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.Size)}
                        helperText={errors?.Size}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"PricePerSQFT"}
                        label={`Price Per SQFT`}
                        id={"PricePerSQFT"}
                        // onChange={(e) => {
                        //   handleUnitsChange(e, "PricePerSQFT", index);
                        // }}
                        value={parseFloat(item.Price / item.Size).toFixed(3)}
                        variant="outlined"
                        size="medium"
                        // error={Boolean(errors?.PricePerSQFT)}
                        // helperText={errors?.PricePerSQFT}
                        disabled
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name={"Bedrooms"}
                        label={`Bedrooms`}
                        id={"Bedrooms"}
                        onChange={(e) => {
                          handleUnitsChange(e, "Bedrooms", index);
                        }}
                        value={item.Bedrooms}
                        variant="outlined"
                        size="medium"
                        error={Boolean(errors?.Bedrooms)}
                        helperText={errors?.Bedrooms}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <TextField
                        fullWidth
                        type="number"
                        name="EstimatedRent"
                        label={`Estimated Rent`}
                        id="EstimatedRent"
                        onChange={(e) => {
                          handleUnitsChange(e, "EstimatedRent", index);
                        }}
                        value={item.EstimatedRent}
                        variant="outlined"
                        size="medium"
                        required
                        error={Boolean(errors?.EstimatedRent)}
                        helperText={errors?.EstimatedRent}
                        disabled={disableField}
                      />
                    </div>
                    <div className="flex m-4">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) => {
                                handleUnitsChange(e, "Bacloney", index);
                              }}
                              name={"Bacloney"}
                              value={item.Bacloney}
                              checked={item.Bacloney}
                              disabled={disableField}
                            />
                          }
                          label={item.Bacloney ? "Balcony" : "No Balcony"}
                        />
                      </FormGroup>
                    </div>
                    <div
                      className={`flex m-4 transition-all duration-200 ${
                        item.Bacloney ? "scale-100" : "scale-0"
                      }`}
                    >
                      <TextField
                        fullWidth
                        type="number"
                        name={`BalconySize`}
                        label={`Balcony Size`}
                        id={"BalconySize" + index}
                        onChange={(e) => {
                          handleUnitsChange(e, "BalconySize", index);
                        }}
                        value={item.BalconySize}
                        variant="outlined"
                        size="medium"
                        disabled={disableField}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
            <p className="font-bold tex-2xl m-4">Location Details</p>
            <div className="grid grid-cols-2">
              {addressesisSuccess && (
                <div className="flex m-4">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Address
                    </InputLabel>
                    <Select
                      labelId="AddressID"
                      name="AddressID"
                      id="AddressID"
                      value={values.AddressID}
                      label="Address"
                      onChange={handleChange}
                      MenuProps={{
                        autoFocus: false,
                        style: {
                          maxHeight: "400px",
                        },
                      }}
                      onClose={() => setSelectSearchTerm("")}
                      onAnimationEnd={() => selectSearchInput.current?.focus()}
                      error={Boolean(errors?.AddressID)}
                      disabled={disableField}
                    >
                      <ListSubheader>
                        <TextField
                          ref={selectSearchInput}
                          fullWidth
                          type="text"
                          name="SelectSearchTerm"
                          placeholder="Search for Address"
                          id="SelectSearchTerm"
                          onChange={(e) => setSelectSearchTerm(e.target.value)}
                          value={selectSearchTerm}
                          variant="outlined"
                          size="medium"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key !== "Escape") {
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

                      {addresses.allNested.ids?.map((item, j) => {
                        if (
                          addresses.allNested?.entities[
                            item
                          ]?.Address_Translation.find(
                            (x) => x.Language.Code == "En"
                          )
                            ?.Name.toLowerCase()
                            .includes(selectSearchTerm.toLowerCase())
                        )
                          return (
                            <MenuItem
                              key={j}
                              value={item}
                              onClick={() =>
                                setDefaultLatLng({
                                  lat: addresses.allNested.entities[item]
                                    .Latitude,
                                  lng: addresses.allNested.entities[item]
                                    .Longitude,
                                })
                              }
                            >
                              {
                                addresses.allNested.entities[
                                  item
                                ]?.Address_Translation.find(
                                  (x) => x.Language.Code == "En"
                                )?.Name
                              }
                            </MenuItem>
                          );
                      })}
                    </Select>
                    <p className="text-[14px] text-red-600 ml-5">
                      {errors.AddressID}
                    </p>
                  </FormControl>
                </div>
              )}
              <div className="col-span-full h-[500px] w-full">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY ?? ""}>
                  <Map
                    zoom={14}
                    center={{
                      lat: defaultLatLng.lat,
                      lng: defaultLatLng.lng,
                    }}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    mapId={import.meta.env.VITE_GOOGLE_MAP_ID ?? ""}
                    onClick={(event) => {
                      setDefaultLatLng({
                        lat: event.detail.latLng.lat,
                        lng: event.detail.latLng.lng,
                      });
                    }}
                  >
                    <AdvancedMarker
                      position={{
                        lat: defaultLatLng.lat,
                        lng: defaultLatLng.lng,
                      }}
                    >
                      <Pin
                        background={"rgba(221, 178, 110, 1)"}
                        glyphColor={"rgba(8, 12, 19, 1)"}
                        borderColor={"rgba(8, 12, 19, 1)"}
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              </div>
            </div>
          </div>
          <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
            <p className="font-bold tex-2xl m-4">Other Details</p>
            <div className="grid grid-cols-2">
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="text"
                  name="ReraNo"
                  label={`Rera No`}
                  id="ReraNo"
                  onChange={handleChange}
                  value={values.ReraNo}
                  variant="outlined"
                  size="medium"
                  error={Boolean(errors?.ReraNo)}
                  helperText={errors?.ReraNo}
                  disabled={disableField}
                />
              </div>
              {/* <div className="flex m-4">
                <TextField
                  fullWidth
                  type="text"
                  name="BRNNo"
                  label={`BRN No`}
                  id="BRNNo"
                  onChange={handleChange}
                  value={values.BRNNo}
                  variant="outlined"
                  size="medium"
                  error={Boolean(errors?.BRNNo)}
                  helperText={errors?.BRNNo}
                  disabled={disableField}
                />
              </div> */}

              <div className="flex m-4">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={handleChange}
                        name="ActiveStatus"
                        value={values.ActiveStatus}
                        checked={values.ActiveStatus}
                        disabled={disableField}
                      />
                    }
                    label={values.ActiveStatus ? "Active" : "InActive"}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          {Object.keys(paymentPlan).length !== 0 && drawerID !== "" && (
            <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
              <p className="font-bold tex-2xl m-4">Payment Plan</p>
              <div className="grid grid-cols-2">
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="DownPayemnt"
                    label={`Down Payemnt`}
                    id="DownPayemnt"
                    value={paymentPlan.DownPayemnt}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="DuringConstructionMonths"
                    label={`During Construction Months`}
                    id="DuringConstructionMonths"
                    value={paymentPlan.DuringConstructionMonths}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="DuringConstructionPercentage"
                    label={`During Construction Percentage`}
                    id="DuringConstructionPercentage"
                    value={paymentPlan.DuringConstructionPercentage}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="HandoverDate"
                    label={`Handover Date`}
                    id="HandoverDate"
                    value={paymentPlan.HandoverDate.split("T")[0]}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>

                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="OnHandoverPercentage"
                    label={`On Handover Percentage`}
                    id="OnHandoverPercentage"
                    value={paymentPlan.OnHandoverPercentage}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="Posthandover"
                    label={`Posthandover`}
                    id="Posthandover"
                    value={paymentPlan.Posthandover ? "YES" : "NO"}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
                {paymentPlan?.Posthandover && (
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name="NoOfPosthandoverMonths"
                      label={`Number Of Posthandover Months`}
                      id="NoOfPosthandoverMonths"
                      value={paymentPlan.NoOfPosthandoverMonths}
                      variant="outlined"
                      size="medium"
                      disabled
                    />
                  </div>
                )}
                {paymentPlan?.Posthandover && (
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name="PosthandoverPercentage"
                      label={`Posthandover Percentage`}
                      id="PosthandoverPercentage"
                      value={paymentPlan.PosthandoverPercentage}
                      variant="outlined"
                      size="medium"
                      disabled
                    />
                  </div>
                )}
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name="TotalMonths"
                    label={`Total Months`}
                    id="TotalMonths"
                    value={paymentPlan.TotalMonths}
                    variant="outlined"
                    size="medium"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}
          {Object.keys(paymentPlan).length !== 0 && drawerID !== "" && (
            <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
              <p className="font-bold tex-2xl m-4">Installments</p>
              <table className="w-full border-2 border-black/30">
                <tbody>
                  <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
                    <th className="p-2 border-black/30 border-2">Number</th>
                    <th className="p-2 border-black/30 border-2">
                      Description
                    </th>
                    <th className="p-2 border-black/30 border-2">
                      Percentage Of Payment
                    </th>
                    <th className="p-2 border-black/30 border-2">Amount</th>
                    <th className="p-2 border-black/30 border-2">Date</th>
                  </tr>
                  {paymentPlan?.Installments?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-black/30 border-2 text-tiny md:text-smaller text-center"
                      >
                        <td className="p-2 border-black/30 border-2 font-bold text-start">
                          {item.Number}
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          {
                            item.Installments_Translation.find(
                              (x) => x.Language.Code == "En"
                            ).Description
                          }
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          {item.PercentageOfPayment}
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          {item.Amount}
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          {item.Date.split("T")[0]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
    );
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Buy Property" : "Edit Buy Property"}
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
        addressesIsLoading ||
        addressesIsFethcing ||
        categoriesIsLoading ||
        categoriesIsFethcing ||
        developersIsLoading ||
        developersIsFethcing ||
        amenitiesIsLoading ||
        amenitiesIsFethcing ||
        deleteSingleImageIsLoading ||
        deleteAllImagesIsLoading ||
        lngIsLoading ||
        lngIsFethcing ? (
          <div className="flex flex-row justify-center items-center h-screen w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="text-med font-LIT">
            {/* <PDFViewer width={"100%"} height={"500px"}>
              <PropertyBuyPDF />
            </PDFViewer> */}
            {formElements()}
          </div>
        )
      }
    />
  );
};

export default PropertyBuyDrawer;
