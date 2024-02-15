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
  VacantStatus,
  FurnishingStatus,
  RentFrequency,
} from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import {
  useDeleteAllPropertyImagesMutation,
  useDeleteImageMutation,
} from "../../redux/images/imagesSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
const defaultFormState = {
  id: "",
  RentMin: "",
  RentMax: "",
  FurnishingStatus: "Furnished",
  VacantStatus: "No",
  Longitude: 55.26969018195244,
  Latitude: 25.188872617717333,
  RentFrequency: "Yearly",
  ReraNo: "",
  // BRNNo: "",
  Images: "",
  MetaData: "",
  Aminities: [],
  DeveloperID: "",
  CategoryID: "",
  AddressID: "",
  // size: "",
  ActiveStatus: true,
  Bacloney: false,
  BalconySize: "",
  Bathrooms: "",
  Bedrooms: "",
  DEDNo: "",
  PermitNumber: "",
  Price: "",
  PricePerSQFT: "",
  Size: "",
};

const PropertyRentDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [properties_Translation, setProperties_Translation] = useState([]);
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
  } = useForm(
    submit,
    defaultFormState,
    properties_Translation,
    setProperties_Translation
  );
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState([]);
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
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
            DeveloperID: data.developerId,
            AddressID: data.addressId,
            CategoryID: data.categoryId,
            Aminities: loadedAmenities,
            id: data.propertyUnits[0].id,
            Bacloney: data.propertyUnits[0].Bacloney,
            BalconySize: data.propertyUnits[0].BalconySize,
            Bathrooms: data.propertyUnits[0].Bathrooms,
            Bedrooms: data.propertyUnits[0].Bedrooms,
            DEDNo: data.propertyUnits[0].DEDNo,
            PermitNumber: data.propertyUnits[0].PermitNumber,
            Price: data.propertyUnits[0].Price,
            PricePerSQFT: data.propertyUnits[0].PricePerSQFT,
            Size: data.propertyUnits[0].Size,
          });
          setProperties_Translation(data.Property_Translation);
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
  };
  function submit(event) {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("RentMin", values.RentMin);
    formData.append("RentMax", values.RentMax);
    formData.append("RentFrequency", values.RentFrequency);
    formData.append("FurnishingStatus", values.FurnishingStatus);
    formData.append("VacantStatus", values.VacantStatus);
    formData.append("Longitude", defaultLatLng.lng);
    formData.append("Latitude", defaultLatLng.lat);
    formData.append("Purpose", "Rent");
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
    drawerID !== "" && formData.append(`propertyUnits[0][id]`, values.id);
    formData.append(`propertyUnits[0][Bacloney]`, values.Bacloney);
    formData.append(`propertyUnits[0][BalconySize]`, values.BalconySize);
    formData.append(`propertyUnits[0][Bathrooms]`, values.Bathrooms);
    formData.append(`propertyUnits[0][Bedrooms]`, values.Bedrooms);
    formData.append(`propertyUnits[0][DEDNo]`, values.DEDNo);
    formData.append(`propertyUnits[0][PermitNumber]`, values.PermitNumber);
    formData.append(`propertyUnits[0][Price]`, values.Price);
    formData.append(
      `propertyUnits[0][PricePerSQFT]`,
      parseFloat(values.Price / values.Size).toFixed(3)
    );
    formData.append(`propertyUnits[0][Size]`, values.Size);

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
                  className="text-center cursor-pointer flex items-center gap-x-2 bg-primary rounded-lg p-1"
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
                        className="disabled:bg-gray-500 disabled:opacity-50 text-center cursor-pointer absolute left-0 top-0 bg-primary rounded-br-lg rounded-tl-md pb-1 shadow-lg"
                        disabled={disableField}
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
                <button
                  disabled={disableField}
                  onClick={() => {
                    deleteallPropertyImages({ id: drawerID });
                  }}
                  className="disabled:bg-gray-500 disabled:opacity-50 text-center cursor-pointer flex items-center gap-x-2 bg-primary rounded-lg p-1"
                >
                  <DeleteSweepOutlinedIcon fontSize="large" color="error" />
                  <p className="text-red-600">Delete All</p>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 max-h-[640px] overflow-y-scroll place-items-center">
                {data.Images?.map((item, index) => (
                  <div className="relative" key={index}>
                    <img
                      key={index}
                      className="col-span-1 h-[300px] w-[400px] rounded-md"
                      src={API_BASE_URL + item?.URL}
                    />
                    <button
                      disabled={disableField}
                      onClick={() => {
                        deleteImage({ id: item.id });
                      }}
                      className="text-center cursor-pointer absolute left-0 top-0 bg-primary rounded-br-lg rounded-tl-md pb-1 shadow-lg"
                    >
                      <DeleteOutlinedIcon fontSize="large" color="error" />
                    </button>
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
              <div className={`flex m-4`}>
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
            </div>
          </div>
          <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
            <p className="font-bold tex-2xl m-4">Rent Details</p>
            <div className="grid grid-cols-2">
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="RentMin"
                  label={`Rent Minimum`}
                  id="RentMin"
                  onChange={handleChange}
                  value={values.RentMin}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.RentMin)}
                  helperText={errors?.RentMin}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="RentMax"
                  label={`Rent Maximum`}
                  id="RentMax"
                  onChange={handleChange}
                  value={values.RentMax}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.RentMax)}
                  helperText={errors?.RentMax}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Rent Frequency
                  </InputLabel>
                  <Select
                    labelId="Rent Frequency"
                    name="RentFrequency"
                    id="RentFrequency"
                    value={values.RentFrequency}
                    label="Rent Frequency"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={disableField}
                  >
                    {RentFrequency?.map((item, j) => {
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
          <div className="bg-secondary/10 p-4 space-y-4 rounded-lg mt-8 shadow-lg">
            <p className="font-bold tex-2xl m-4">Unit Details</p>
            <div className="grid grid-cols-2">
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="Bathrooms"
                  label={`Bathrooms`}
                  id="Bathrooms"
                  onChange={handleChange}
                  value={values.Bathrooms}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.Bathrooms)}
                  helperText={errors?.Bathrooms}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="DEDNo"
                  label={`DEDNo`}
                  id="DEDNo"
                  onChange={handleChange}
                  value={values.DEDNo}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.DEDNo)}
                  helperText={errors?.DEDNo}
                  disabled={disableField}
                />
              </div>

              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="PermitNumber"
                  label={`Permit Number`}
                  id="PermitNumber"
                  onChange={handleChange}
                  value={values.PermitNumber}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.PermitNumber)}
                  helperText={errors?.PermitNumber}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="Price"
                  label={`Price`}
                  id="Price"
                  onChange={handleChange}
                  value={values.Price}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.Price)}
                  helperText={errors?.Price}
                  disabled={disableField}
                />
              </div>

              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="Size"
                  label={`Size`}
                  id="Size"
                  onChange={handleChange}
                  value={values.Size}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.Size)}
                  helperText={errors?.Size}
                  disabled={disableField}
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="PricePerSQFT"
                  label={`Price Per SQFT`}
                  id="PricePerSQFT"
                  // onChange={handleChange}
                  value={parseFloat(values.Price / values.Size).toFixed(3)}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.PricePerSQFT)}
                  helperText={errors?.PricePerSQFT}
                  disabled
                />
              </div>
              <div className="flex m-4">
                <TextField
                  fullWidth
                  type="number"
                  name="Bedrooms"
                  label={`Bedrooms`}
                  id="Bedrooms"
                  onChange={handleChange}
                  value={values.Bedrooms}
                  variant="outlined"
                  size="medium"
                  required
                  error={Boolean(errors?.Bedrooms)}
                  helperText={errors?.Bedrooms}
                  disabled={disableField}
                />
              </div>

              <div className="flex m-4">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={handleChange}
                        name="Bacloney"
                        value={values.Bacloney}
                        checked={values.Bacloney}
                        disabled={disableField}
                      />
                    }
                    label={values.Bacloney ? "Balcony" : "No Balcony"}
                  />
                </FormGroup>
              </div>
              <div
                className={`flex m-4 transition-all duration-200 ${
                  values.Bacloney ? "scale-100" : "scale-0"
                }`}
              >
                <TextField
                  fullWidth
                  type="number"
                  name="BalconySize"
                  label={`Balcony Size`}
                  id="BalconySize"
                  onChange={handleChange}
                  value={values.BalconySize}
                  variant="outlined"
                  size="medium"
                  required
                  disabled={disableField}
                />
              </div>
            </div>
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
                          addresses?.allNested.entities[
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
                    scrollwheel={false}
                    zoomControl
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
                  required
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
                  required
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
        </div>
      </form>
    );
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Rent Property" : "Edit Rent Property"}
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
          <div className="text-med font-LIT">{formElements()}</div>
        )
      }
    />
  );
};

export default PropertyRentDrawer;
