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
import { Add, CleanHands, Delete, Remove } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

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

const PropertyPDFDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [properties_Translation, setProperties_Translation] = useState([]);
  const [units, setUnits] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState({});
  const [pdfScaler, setPdfScaler] = useState(1);

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

  const dispatch = useDispatch();
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

  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setImage([]);
    setImageURL([]);
    setOldImage(null);
    setProperties_Translation([]);
    setErrors({});
    setUnits([]);
  };
  function submit(event) {}

  // useEffect(() => {
  //   if (profileIsSuccess) {
  //     if (drawerID !== "") {
  //       if (
  //         profile.Role.Role_Resources.find((x) => x.resource.Name == "Property")
  //           .Update == true
  //       ) {
  //         setDisableField(false);
  //       } else {
  //         setDisableField(true);
  //       }
  //     }
  //   }
  // }, [profileIsSuccess, profile, drawerID]);

  const formElements = () => {
    return (
      <div className="flex justify-center items-start -mt-6 overflow-auto">
        <div
          className={` `}
          style={{
            width: 1240 * pdfScaler + "px",
          }}
        >
          <div
            className={`w-full relative `}
            style={{
              height: 750 * pdfScaler + "px",
            }}
          >
            <img
              src={API_BASE_URL + values?.Images[0]?.URL}
              className="w-full h-full"
              alt=""
            />
            <div className="bg-[#141330]/40 w-full h-full absolute left-0 top-0" />
          </div>
        </div>
      </div>
    );
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={"PDF View"}
      newItem={true}
      editable={true}
      modalWidth={"max-w-[1240px]"}
      drawerH={"h-full max-h-[80vh]"}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={disabled}
      children={
        isLoading ||
        isFetching ||
        addressesIsLoading ||
        addressesIsFethcing ||
        categoriesIsLoading ||
        categoriesIsFethcing ||
        developersIsLoading ||
        developersIsFethcing ||
        amenitiesIsLoading ||
        amenitiesIsFethcing ||
        lngIsLoading ||
        lngIsFethcing ? (
          <div className="flex flex-row justify-center items-center h-screen w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="fixed top-24 right-32 bg-secondary/80 h-[50px] w-[130px] rounded-md shadow-2xl grid grid-cols-4 gap-0 z-40">
              <div
                className="flex justify-center items-center border-r-2 border-white cursor-pointer"
                onClick={() => {
                  if (pdfScaler > 0.25) setPdfScaler(pdfScaler - 0.25);
                }}
              >
                <Remove sx={{ color: "white" }} />
              </div>
              <div className="flex justify-center items-center border-r-2 border-white col-span-2 text-white">
                {pdfScaler * 100}%
              </div>
              <div
                className="flex justify-center items-center cursor-pointer"
                onClick={() => {
                  if (pdfScaler < 1.5) setPdfScaler(pdfScaler + 0.25);
                }}
              >
                <Add sx={{ color: "white" }} />
              </div>
            </div>

            {formElements()}
          </div>
        )
      }
    />
  );
};

export default PropertyPDFDrawer;
