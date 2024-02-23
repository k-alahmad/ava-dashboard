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
  const {
    data: profile,
    isSuccess: profileIsSuccess,
    isLoading: profileIsLoading,
    isFetching: profileIsFetching,
  } = useGetProfileQuery();
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
      <div className="flex justify-center items-start -mt-8 overflow-auto">
        <div
          className={`space-y-4 `}
          style={{
            width: 1024 * pdfScaler + "px",
          }}
        >
          <div
            className={`w-full relative `}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <img
              src={API_BASE_URL + values?.Images[0]?.URL}
              className="w-full h-full object-center"
              alt=""
            />
            <div className="bg-[#141330]/40 w-full h-full absolute left-0 top-0" />

            <img
              src={API_BASE_URL + values?.Developer?.Image.URL}
              className="absolute left-5 top-5 w-[200px] h-[150px]"
              alt=""
            />

            <div className="absolute left-0 top-1/2 -translate-y-1/2 p-12 bg-[#141330] w-[35%] text-white">
              <p className=" font-bold text-med">
                {
                  values?.Property_Translation?.find(
                    (x) => x.Language.Code == "En"
                  ).Name
                }
              </p>
              <p className="text-small">
                {
                  values?.Developer?.Developer_Translation?.find(
                    (x) => x.Language.Code == "En"
                  ).Name
                }
                <span className="text-primary"> _____________</span>
              </p>
            </div>
            <div className="absolute right-7 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/40 rounded-2xl p-8 w-[35%]">
              <p className="text-med font-bold text-[#141330]">
                {profile.Name}
              </p>
              <div className="grid grid-cols-3 text-white text-tiny mt-4 gap-4">
                <p className="col-span-1">Address:</p>
                <p className="col-span-2">
                  Office 609, Clover Bay Tower - 6a Marasi Dr - Business Bay -
                  Dubai
                </p>
                <p className="col-span-1">Email:</p>
                <p className="col-span-2">info@avarealestate.ae</p>
                <p className="col-span-1">Phone:</p>
                <p className="col-span-2">+971501108606</p>
              </div>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            className={`w-full relative bg-[#141330]`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <img
              src={API_BASE_URL + values?.Images[1]?.URL}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[90%] object-left object-cover z-10"
              alt=""
            />

            <div className="bg-primary absolute h-[85%] w-[5%] left-[6%] top-1/2 -translate-y-1/2" />
            <img
              src={API_BASE_URL + values?.Developer?.Image.URL}
              className="absolute left-[12%] bottom-[7%] w-[200px] h-[150px] z-10"
              alt=""
            />
            <div className="absolute bottom-3 w-full h-5 flex justify-end items-center">
              <div className="flex justify-center items-center h-5 w-5 bg-white text-black rounded-full">
                1
              </div>
              <div className="w-[95%] h-px bg-white" />
            </div>
          </div>
          {/* -------------------------- */}
          <div
            className={`w-full relative bg-[#141330]`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="grid grid-cols-6 gap-4 w-full h-full place-items-center">
              <div className="col-span-1 w-full h-full relative">
                <img
                  src={API_BASE_URL + values?.Images[1]?.URL}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[90%] object-right object-cover z-10"
                  alt=""
                />
              </div>

              <div className="col-span-5 flex flex-col justify-start items-center w-[95%] h-[90%] overflow-hidden">
                <p className="text-med font-bold text-primary">Description</p>
                <div
                  className="text-white mt-5 overflow-auto"
                  dangerouslySetInnerHTML={{
                    __html: values?.Property_Translation?.find(
                      (x) => x.Language.Code == "En"
                    ).Description,
                  }}
                />
              </div>
            </div>

            <div className="absolute bottom-3 w-full h-5 flex justify-start items-center">
              <div className="w-[95%] h-px bg-white" />
              <div className="flex justify-center items-center h-5 w-5 bg-white text-black rounded-full">
                2
              </div>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            className={`w-full relative `}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          ></div>
          {/* -------------------------- */}
          <div
            className={`w-full relative `}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          ></div>
          {/* -------------------------- */}
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
        profileIsLoading ||
        profileIsFetching ||
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
                  if (pdfScaler > 1) setPdfScaler(pdfScaler - 0.25);
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
