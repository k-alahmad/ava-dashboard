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
import { CircularProgress } from "@mui/material";
import { API_BASE_URL } from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import useForm from "../../hooks/useForm";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import paymentIcon from "../../assets/icons/payment.svg";
import websiteIcon from "../../assets/icons/website.svg";
import locationIcon from "../../assets/icons/location.svg";
import mailIcon from "../../assets/icons/mail2.svg";
import phoneIcon from "../../assets/icons/phone-blue.svg";

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
  const [pdfCount, setPdfCount] = useState([
    "pdf1",
    "pdf2",
    "pdf3",
    "pdf4",
    "pdf5",
    "pdf6",
    "pdf7",
    "pdf8",
    "pdf9",
    // "pdf10",
  ]);
  function submit(event) {}
  const [pdfLoading, setPdfLoading] = useState(false);
  const createPDF = async () => {
    const pdf = new jsPDF("landscape", "pt", "a4");
    setPdfLoading(true);
    for (let i = 0; i < pdfCount.length; i++) {
      const data = await html2canvas(document.querySelector("#pdf" + (i + 1)), {
        // allowTaint: true,
        useCORS: true,
      });
      const img = data.toDataURL("image/png");
      // const imgProperties = pdf.getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      const pdfHeight = pdf.internal.pageSize.getHeight();

      if (i > 0) pdf.addPage("a4", "landscape");
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    }
    setPdfLoading(false);
    pdf.save(
      values?.Property_Translation?.find((x) => x.Language.Code == "En").Name +
        "Property"
    );
  };
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
            id="pdf1"
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
              alt="pdf1"
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
            id="pdf2"
            className={`w-full relative bg-[#141330] overflow-hidden`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <img
              src={API_BASE_URL + values?.Images[1]?.URL}
              className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-full h-[90%] object-left object-cover z-10"
              alt="pdf2"
            />

            <div className="bg-primary absolute h-[85%] w-[5%] left-[6%] top-1/2 -translate-y-1/2" />
            <img
              src={API_BASE_URL + values?.Developer?.Image.URL}
              className="absolute left-[12%] bottom-[7%] w-[200px] h-[150px] z-10"
              alt="pdf2Logo"
            />
            <div className="absolute bottom-5 w-[95%] right-0 h-px bg-white" />
            <div className="absolute bottom-2.5 left-[5%] h-6 w-6 bg-white rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 ">1</p>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            id="pdf3"
            className={`w-full relative overflow-hidden bg-[#141330]`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="grid grid-cols-6 gap-4 w-full h-full place-items-center ">
              <img
                src={API_BASE_URL + values?.Images[1]?.URL}
                className="absolute -left-[83%] top-1/2 -translate-y-1/2 !w-full h-[90%]"
                alt="pdf3"
              />
              <div className="col-span-1 w-full h-full relative overflow-hidden"></div>

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

            <div className="absolute bottom-5 w-[95%] h-px bg-white" />
            <div className="absolute bottom-2.5 right-[5%] h-6 w-6 bg-white rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 ">2</p>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            id="pdf4"
            className={`w-full relative  bg-gray-50 pt-10`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
              <div>
                <p className="text-primary text-[40px] font-bold">Inventory</p>
                <div className="w-[100px] h-px bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-16 m-14">
              {units.map((item, index) => {
                if (index <= 1)
                  return (
                    <div key={index} className="relative">
                      <div className="absolute -top-[30px] -left-[30px] h-[100px] w-[100px] bg-primary p-0.5 z-0">
                        <div className="w-full h-full bg-gray-50" />
                      </div>
                      <div className="bg-[#141330] p-4 flex flex-col justify-start items-center text-white relative min-h-[300px]">
                        <p className="text-small font-bold">
                          {item.Bedrooms > 0
                            ? item.Bedrooms + " Bedroom"
                            : "Studio"}
                        </p>
                        <div className="grid grid-cols-11 mt-5">
                          <div className="flex gap-x-1 justify-center items-center col-span-3">
                            <div>*</div>
                            <p>{item.Bathrooms + " Bathrooms"}</p>
                          </div>
                          <div className="flex justify-center items-center">
                            <div className="w-px h-full bg-white" />
                          </div>
                          <div className="flex gap-x-1 justify-center items-center col-span-3">
                            <div>*</div>
                            <p>
                              {item.Bedrooms > 0
                                ? item.Bedrooms + " Bedroom"
                                : "Studio"}
                            </p>
                          </div>
                          <div className="flex justify-center items-center">
                            <div className="w-px h-full bg-white" />
                          </div>
                          <div className="flex gap-x-1 justify-center items-center col-span-3">
                            <div>*</div>
                            <p>
                              <p>{item.Size + " SQ.FT."}</p>
                            </p>
                          </div>
                        </div>
                        <div className="mt-8 flex flex-col justify-center items-center">
                          <div className="space-y-2">
                            <div className="flex gap-x-2">
                              <div>*</div>
                              <p>Price Of Unit: {item.Price}</p>
                            </div>
                            <div className="flex gap-x-2">
                              <div>*</div>
                              <p>Price Per SQ.FT.: {item.PricePerSQFT}</p>
                            </div>
                            {/* <div className="flex gap-x-2">
                              <div>*</div>
                              <p>Price Per SQ.FT.: {item.PricePerSQFT}</p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div>{/* {image} */}</div>
                    </div>
                  );
              })}
            </div>
            <div className="absolute bottom-5 w-[95%] right-0 h-px bg-[#141330]" />
            <div className="absolute bottom-2.5 left-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                3
              </p>
            </div>
          </div>
          {/* -------------------------- */}
          {units.length > 2 && (
            <div
              id="pdf5"
              className={`w-full relative  bg-gray-50 pt-16`}
              style={{
                height: 780 * pdfScaler + "px",
              }}
            >
              <div className="grid grid-cols-2 gap-16 m-14">
                {units.map((item, index) => {
                  if (index > 1 && index < 4)
                    return (
                      <div key={index} className="relative">
                        <div className="absolute -top-[30px] -left-[30px] h-[100px] w-[100px] bg-primary p-0.5 z-0">
                          <div className="w-full h-full bg-gray-50" />
                        </div>
                        <div className="bg-[#141330] p-4 flex flex-col justify-start items-center text-white relative min-h-[300px]">
                          <p className="text-small font-bold">
                            {item.Bedrooms > 0
                              ? item.Bedrooms + " Bedroom"
                              : "Studio"}
                          </p>
                          <div className="grid grid-cols-11 mt-5">
                            <div className="flex gap-x-1 justify-center items-center col-span-3">
                              <div>*</div>
                              <p>{item.Bathrooms + " Bathrooms"}</p>
                            </div>
                            <div className="flex justify-center items-center">
                              <div className="w-px h-full bg-white" />
                            </div>
                            <div className="flex gap-x-1 justify-center items-center col-span-3">
                              <div>*</div>
                              <p>
                                {item.Bedrooms > 0
                                  ? item.Bedrooms + " Bedroom"
                                  : "Studio"}
                              </p>
                            </div>
                            <div className="flex justify-center items-center">
                              <div className="w-px h-full bg-white" />
                            </div>
                            <div className="flex gap-x-1 justify-center items-center col-span-3">
                              <div>*</div>
                              <p>
                                <p>{item.Size + " SQ.FT."}</p>
                              </p>
                            </div>
                          </div>
                          <div className="mt-8 flex flex-col justify-center items-center">
                            <div className="space-y-2">
                              <div className="flex gap-x-2">
                                <div>*</div>
                                <p>Price Of Unit: {item.Price}</p>
                              </div>
                              <div className="flex gap-x-2">
                                <div>*</div>
                                <p>Price Per SQ.FT.: {item.PricePerSQFT}</p>
                              </div>
                              {/* <div className="flex gap-x-2">
                              <div>*</div>
                              <p>Price Per SQ.FT.: {item.PricePerSQFT}</p>
                            </div> */}
                            </div>
                          </div>
                        </div>
                        <div>{/* {image} */}</div>
                      </div>
                    );
                })}
              </div>
              <div className="absolute bottom-5 w-[95%] h-px bg-[#141330]" />
              <div className="absolute bottom-2.5 right-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
                <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                  4
                </p>
              </div>
            </div>
          )}

          {/* -------------------------- */}
          <div
            id="pdf6"
            className={`w-full relative  bg-gray-50 pt-10`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
              <div>
                <p className="text-primary text-[40px] font-bold">
                  Feature & Amenities
                </p>
                <div className="w-[100px] h-px bg-white" />
              </div>
            </div>
            <div className="mt-20 grid grid-cols-4 gap-x-7 gap-y-20 px-7 place-items-center">
              {data?.Aminities.map((item, index) => {
                return (
                  <div key={index} className="relative">
                    <img
                      src={API_BASE_URL + item.Image.URL}
                      alt={"AIMAGE" + (index + 1)}
                      className="bg-gray-50 h-[100px] w-[100px] absolute left-[50px] -top-[75px] object-center object-contain"
                    />
                    <div className="bg-[#141330] pt-8 pb-4 px-4 flex flex-col justify-start items-center w-[200px] h-[200px] text-white">
                      <p className="font-bold text-smaller text-center">
                        {
                          item.Aminities_Translation.find(
                            (x) => x.Language.Code == "En"
                          ).Name
                        }
                      </p>
                      <p className="text-[14px] mt-5">
                        {
                          item.Aminities_Translation.find(
                            (x) => x.Language.Code == "En"
                          ).Description
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-5 w-[95%] right-0 h-px bg-[#141330]" />
            <div className="absolute bottom-2.5 left-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                5
              </p>
            </div>
          </div>

          {/* -------------------------- */}

          <div
            id="pdf7"
            className={`w-full relative  bg-gray-50 `}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="relative p-7">
              <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4 absolute left-7 top-12">
                <div>
                  <p className="text-primary text-[40px] font-bold">Gallery</p>
                  <div className="w-[100px] h-px bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 place-items-center">
                {data?.Images?.map((item, index) => {
                  if (index < 3)
                    return (
                      <div
                        key={index}
                        className={`h-[350px] w-full ${
                          index < 1 ? "col-span-2" : "col-span-1"
                        }`}
                      >
                        <img
                          src={API_BASE_URL + item.URL}
                          alt={"images" + index}
                          className={`object-cover object-center w-full h-full`}
                        />
                      </div>
                    );
                })}
              </div>
            </div>
            <div className="absolute bottom-5 w-[95%] h-px bg-[#141330]" />
            <div className="absolute bottom-2.5 right-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                7
              </p>
            </div>
          </div>
          {/* -------------------------- */}
          {data?.Images?.length > 3 && (
            <div
              id="pdf8"
              className={`w-full relative  bg-gray-50 `}
              style={{
                height: 780 * pdfScaler + "px",
              }}
            >
              <div className="relative p-7">
                <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4 absolute left-7 top-12">
                  <div>
                    <p className="text-primary text-[40px] font-bold">
                      Gallery
                    </p>
                    <div className="w-[100px] h-px bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-0 place-items-center">
                  <div className="w-full flex flex-col">
                    {data?.Images?.map((item, index) => {
                      if (index > 2 && index < 5)
                        return (
                          <div key={index} className={`h-[350px] w-full`}>
                            <img
                              src={API_BASE_URL + item.URL}
                              alt={"images" + index}
                              className={`object-cover object-center w-full h-full`}
                            />
                          </div>
                        );
                    })}
                  </div>
                  <div className="w-full flex flex-col">
                    {data?.Images?.map((item, index) => {
                      if (index > 4 && index < 8)
                        return (
                          <div key={index} className={`h-[233px] w-full`}>
                            <img
                              src={API_BASE_URL + item.URL}
                              alt={"images" + index}
                              className={`object-cover object-center w-full h-full`}
                            />
                          </div>
                        );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-5 w-[95%] right-0 h-px bg-[#141330]" />
              <div className="absolute bottom-2.5 left-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
                <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                  8
                </p>
              </div>
            </div>
          )}
          {/* -------------------------- */}
          <div
            id="pdf9"
            className={`w-full relative  bg-gray-50 pt-10`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
              <div>
                <p className="text-primary text-[40px] font-bold">
                  Payment Plan
                </p>
                <div className="w-[100px] h-px bg-white" />
              </div>
            </div>

            <div className="p-14 bg-[#141330] m-12 grid grid-cols-2 gap-4 text-white font-semibold text-smaller">
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment1"
                />
                <p>
                  {"Down Payment: " +
                    data?.propertyUnits[0]?.Paymentplan[0]?.DownPayemnt}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment2"
                />
                <p>
                  {"During Construction /M: " +
                    data?.propertyUnits[0]?.Paymentplan[0]
                      ?.DuringConstructionMonths}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment3"
                />
                <p>
                  {"During Construction %:  " +
                    data?.propertyUnits[0]?.Paymentplan[0]
                      ?.DuringConstructionPercentage}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment4"
                />
                <p>
                  {"Handover Date: " +
                    data?.propertyUnits[0]?.Paymentplan[0]?.HandoverDate.split(
                      "T"
                    )[0]}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment5"
                />
                <p>
                  {"On Handover %:  " +
                    data?.propertyUnits[0]?.Paymentplan[0]
                      ?.OnHandoverPercentage}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment5"
                />
                <p>
                  {"Post handover: " +
                    (data?.propertyUnits[0]?.Paymentplan[0]?.Posthandover
                      ? "YES"
                      : "NO")}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment5"
                />
                <p>
                  {"Post Handover No /M: " +
                    data?.propertyUnits[0]?.Paymentplan[0]
                      ?.NoOfPosthandoverMonths}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment5"
                />
                <p>
                  {"Post Handover %: " +
                    data?.propertyUnits[0]?.Paymentplan[0]
                      ?.PosthandoverPercentage}
                </p>
              </div>
              <div className="flex gap-x-1 justify-start items-center">
                <img
                  src={paymentIcon}
                  className="w-[50px] h-[50px] scale-150"
                  alt="payment5"
                />
                <p>
                  {"Total Installments: " +
                    data?.propertyUnits[0]?.Paymentplan[0]?.TotalMonths}
                </p>
              </div>
            </div>
            <div className="absolute bottom-5 w-[95%] h-px bg-[#141330]" />
            <div className="absolute bottom-2.5 right-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                9
              </p>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            id="pdf10"
            className={`w-full relative  bg-gray-50 pt-10`}
            style={{
              height: 780 * pdfScaler + "px",
            }}
          >
            <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
              <div>
                <p className="text-primary text-[40px] font-bold">Location </p>
                <div className="w-[100px] h-px bg-white" />
              </div>
            </div>

            <div className="m-6"></div>
            <div className="absolute bottom-5 w-[95%] right-0 h-px bg-[#141330]" />
            <div className="absolute bottom-2.5 left-[5%] h-6 w-6 bg-[#141330] rounded-full text-center font-semibold">
              <p className="absolute left-1/2 -translate-x-1/2 -top-2 text-white ">
                10
              </p>
            </div>
          </div>
          {/* -------------------------- */}
          <div
            id="pdf1"
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

            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 backdrop-blur-md bg-white/20 rounded-2xl p-8 w-[40%]">
              <div className="flex flex-col justify-center items-center py-4">
                <div>
                  <p className="text-med font-bold text-white">Contact Us </p>
                  <div className="w-[100px] h-px bg-[#141330]" />
                </div>
              </div>
              <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-start">
                <img
                  src={locationIcon}
                  className="w-8 h-8"
                  alt="locationIcon"
                />
                <p>
                  Office 609, Clover Bay Tower - 6a Marasi Dr - Business Bay -
                  Dubai
                </p>
              </div>
              <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
                <img src={mailIcon} className="w-8 h-8" alt="locationIcon" />
                <p>info@avarealestate.ae</p>
              </div>
              <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
                <img src={phoneIcon} className="w-8 h-8" alt="locationIcon" />
                <p>+971501108606</p>
              </div>
              <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
                <img src={websiteIcon} className="w-8 h-8" alt="locationIcon" />
                <p>www.avarealestate.ae</p>
              </div>
            </div>
          </div>
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
      editable={false}
      pdf={true}
      pdfLoading={pdfLoading}
      modalWidth={"max-w-[1240px]"}
      drawerH={"h-full max-h-[80vh]"}
      onCancelClick={closeDrawer}
      onSaveClick={createPDF}
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
