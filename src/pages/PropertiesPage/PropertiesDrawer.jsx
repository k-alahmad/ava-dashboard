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
  Purpose,
  CompletionStatus,
  RentFrequency,
} from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import {
  useDeleteAllPropertyImagesMutation,
  useDeleteImageMutation,
} from "../../redux/images/imagesSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";

const defaultFormState = {
  id: "",
  // Price: "",
  // Bedrooms: "",
  // Bacloney: false,
  // BalconySize: "",
  RentMin: "",
  RentMax: "",
  Handover: "",
  FurnishingStatus: "",
  VacantStatus: "",
  Longitude: "",
  Latitude: "",
  Purpose: "Rent",
  RentFrequency: "Yearly",
  CompletionStatus: "Ready",
  // PermitNumber: "",
  // DEDNo: "",
  ReraNo: "",
  BRNNo: "",
  Developer: "",
  Category: "",
  Address: "",
  Images: "",
  MetaData: "",
  Aminities: "",
  DeveloperID: "",
  CategoryID: "",
  AddressID: "",
  // size: "",
  ActiveStatus: true,
  Aminities: [],
};

const PropertyDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState([]);
  const [properties_Translation, setProperties_Translation] = useState([]);
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
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
          setForm({
            ...data,
            Bacloney: data.Bacloney,
            DeveloperID: data.developerId,
            AddressID: data.addressId,
            CategoryID: data.categoryId,
            Aminities: loadedAmenities,
          });
          setProperties_Translation(data.Property_Translation);
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
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }
  function handleTranslationChange(e, item, type) {
    // if (drawerID !== "")
    setProperties_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Name: type == "Name" ? e.target.value : obj.Name,
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

  useEffect(() => {
    if (deleteAllImagesIsSuccess || deleteSingleImageIsSuccess)
      getPropertyById({ id: drawerID });
  }, [deleteAllImagesIsSuccess, deleteSingleImageIsSuccess]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
    setImage([]);
    setImageURL([]);
    setOldImage(null);
    setProperties_Translation([]);
    setCurrentSlide();
  };
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    // formData.append("Price", form.Price);
    // formData.append("Bedrooms", form.Bedrooms);
    // formData.append("Bacloney", form.Bacloney);
    // formData.append("BalconySize", form.BalconySize);
    formData.append("RentMin", form.RentMin);
    formData.append("RentMax", form.RentMax);
    formData.append("Handover", form.Handover);
    formData.append("RentFrequency", form.RentFrequency);
    formData.append("CompletionStatus", form.CompletionStatus);
    formData.append("FurnishingStatus", form.FurnishingStatus);
    formData.append("VacantStatus", form.VacantStatus);
    formData.append("Longitude", form.Longitude);
    formData.append("Latitude", form.Latitude);
    formData.append("Purpose", form.Purpose);
    // formData.append("PermitNumber", form.PermitNumber);
    // formData.append("DEDNo", form.DEDNo);
    formData.append("ReraNo", form.ReraNo);
    formData.append("BRNNo", form.BRNNo);
    formData.append("DeveloperID", form.DeveloperID);
    formData.append("CategoryID", form.CategoryID);
    formData.append("AddressID", form.AddressID);
    // formData.append("Area", form.Area);
    formData.append("ActiveStatus", form.ActiveStatus);

    if (form.Aminities) {
      for (let i = 0; i < form.Aminities.length; i++) {
        formData.append("Aminities", form.Aminities[i]);
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

  const formElements = () => {
    return (
      <form ref={formRef} className="justify-center grid grid-cols-3 gap-7">
        <div className="flex flex-col items-center justify-start col-span-1">
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
          {imageURL.length !== 0 && (
            <>
              <p className="text-2xl font-bold">New Images</p>
              <div
                onClick={() => {
                  setImage([]);
                  setImageURL([]);
                }}
                className="text-center cursor-pointer flex items-end"
              >
                Delete All
                <DeleteSweepOutlinedIcon sx={{ fontSize: "50px" }} />
              </div>
              <div className="grid grid-cols-2 m-4">
                {imageURL?.map((imageSrc, i) => {
                  return (
                    <div className="" key={i}>
                      <img
                        key={i}
                        className="h-[200px] w-[200px] m-2 border-2"
                        src={imageSrc}
                        alt=""
                      />
                      <div
                        className="text-center cursor-pointer"
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
                        <DeleteOutlinedIcon /> Delete
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {form.Images?.length !== 0 && !isLoading && (
            <div className="flex flex-col justify-center items-center">
              <p className="text-2xl font-bold">Current Images</p>
              <div
                onClick={() => {
                  deleteallPropertyImages({ id: drawerID });
                }}
                className="text-center cursor-pointer"
              >
                <DeleteSweepOutlinedIcon sx={{ fontSize: "50px" }} /> Delete All
                Images
              </div>
              <div className="grid grid-cols-2 gap-2 m-4">
                {data.Images?.map((item, index) => (
                  <div className="" key={index}>
                    <img
                      key={index}
                      className="col-span-1 h-[200px] w-[200px]"
                      src={API_BASE_URL + item?.URL}
                    />
                    <div
                      onClick={() => {
                        deleteImage({ id: item.id });
                      }}
                      className="text-center cursor-pointer"
                    >
                      <DeleteOutlinedIcon /> Delete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="py-1 mx-8 col-span-2 grid md:grid-cols-2">
          <div className="w-full flex justify-center items-center col-span-full">
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
            accessibility={false}
            ref={sliderRef}
            dots={false}
            touchMove={false}
            swipe={false}
            arrows={false}
            initialSlide={currentSlide}
            infinite={false}
            className="overflow-hidden h-full w-full col-span-full"
          >
            {properties_Translation.map((item, index) => {
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

                  <RichTextBox
                    label={`${item.Language.Name} Description`}
                    value={item.Description}
                    onChange={(e) =>
                      handleTranslationChange(e, item, "Description")
                    }
                  />
                </div>
              );
            })}
          </Slider>
          {/* <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Price"
              label={`Price`}
              id="Price"
              onChange={handleChange}
              value={form.Price}
              variant="outlined"
              size="small"
              required
            />
          </div> */}
          {/* <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Area"
              label={`Area`}
              id="Area"
              onChange={handleChange}
              value={form.Area}
              variant="outlined"
              size="small"
              required
            />
          </div> */}
          {/* <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Bedrooms"
              label={`Bedrooms`}
              id="Bedrooms"
              onChange={handleChange}
              value={form.Bedrooms}
              variant="outlined"
              size="small"
              required
            />
          </div> */}
          {/* <div className="flex m-4">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleChange}
                    name="Bacloney"
                    value={form.Bacloney}
                    checked={form.Bacloney}
                  />
                }
                label={form.Bacloney ? "Balcony" : "No Balcony"}
              />
            </FormGroup>
          </div> */}
          {/* <div
            className={`flex m-4 ${form.Bacloney ? "visible" : "invisible"}`}
          >
            <TextField
              fullWidth
              type="number"
              name="BalconySize"
              label={`Balcony Size`}
              id="BalconySize"
              onChange={handleChange}
              value={form.BalconySize}
              variant="outlined"
              size="small"
              required
            />
          </div> */}

          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="RentMin"
              label={`Rent Minimum`}
              id="RentMin"
              onChange={handleChange}
              value={form.RentMin}
              variant="outlined"
              size="small"
              required
              onWheel={(e) => e.target.blur()}
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
              value={form.RentMax}
              variant="outlined"
              size="small"
              required
              onWheel={(e) => e.target.blur()}
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
              value={form.Handover}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="FurnishingStatus"
              label={`Furnishing Status`}
              id="FurnishingStatus"
              onChange={handleChange}
              value={form.FurnishingStatus}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="VacantStatus"
              label={`Vacant Status`}
              id="VacantStatus"
              onChange={handleChange}
              value={form.VacantStatus}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Longitude"
              label={`Longitude`}
              id="Longitude"
              onChange={handleChange}
              value={form.Longitude}
              variant="outlined"
              size="small"
              required
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="Latitude"
              label={`Latitude`}
              id="Latitude"
              onChange={handleChange}
              value={form.Latitude}
              variant="outlined"
              size="small"
              required
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Purpose</InputLabel>
              <Select
                labelId="Purpose"
                name="Purpose"
                id="Purpose"
                value={form.Purpose}
                label="Purpose"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
              >
                {Purpose?.map((item, j) => {
                  return (
                    <MenuItem key={j} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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
                value={form.RentFrequency}
                label="Rent Frequency"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
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
          <div className="flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Completion Status
              </InputLabel>
              <Select
                labelId="CompletionStatus"
                name="CompletionStatus"
                id="CompletionStatus"
                value={form.CompletionStatus}
                label="Completion Status"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
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
          {/* <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="PermitNumber"
              label={`Permit Number`}
              id="PermitNumber"
              onChange={handleChange}
              value={form.PermitNumber}
              variant="outlined"
              size="small"
              required
            />
          </div> */}
          {/* <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="DEDNo"
              label={`DED No`}
              id="DEDNo"
              onChange={handleChange}
              value={form.DEDNo}
              variant="outlined"
              size="small"
              required
            />
          </div> */}
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="ReraNo"
              label={`Rera No`}
              id="ReraNo"
              onChange={handleChange}
              value={form.ReraNo}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="BRNNo"
              label={`BRN No`}
              id="BRNNo"
              onChange={handleChange}
              value={form.BRNNo}
              variant="outlined"
              size="small"
              required
            />
          </div>
          {categoriesisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="CategoryID"
                  name="CategoryID"
                  id="CategoryID"
                  value={form.CategoryID}
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
                      size="small"
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
              </FormControl>
            </div>
          )}
          {addressesisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Address</InputLabel>
                <Select
                  labelId="AddressID"
                  name="AddressID"
                  id="AddressID"
                  value={form.AddressID}
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
                      size="small"
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
                        <MenuItem key={j} value={item}>
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
              </FormControl>
            </div>
          )}
          {developersisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Developer</InputLabel>
                <Select
                  labelId="DeveloperID"
                  name="DeveloperID"
                  id="DeveloperID"
                  value={form.DeveloperID}
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
                      size="small"
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
                      developers?.entities[item]?.Developer_Translation.find(
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
              </FormControl>
            </div>
          )}
          {amenitiesisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Amenities</InputLabel>
                <Select
                  labelId="Aminities"
                  name="Aminities"
                  id="Aminities"
                  value={form.Aminities}
                  label="Amenities"
                  onChange={(e) =>
                    setForm({
                      ...form,
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
                      size="small"
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
      title={drawerID == "" ? "New Property" : "Edit Property"}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      // disabled={      }
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

export default PropertyDrawer;
