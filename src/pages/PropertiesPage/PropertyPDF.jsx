import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetPropertyByIdQuery } from "../../redux/properties/propertiesSlice";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import { CircularProgress, TextField } from "@mui/material";
import { API_BASE_URL } from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import useForm from "../../hooks/useForm";
import {
  Add,
  Close,
  Delete,
  Done,
  Edit,
  Remove,
  Undo,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import paymentIcon from "../../assets/icons/payment.png";
import websiteIcon from "../../assets/icons/website.png";
import locationIcon from "../../assets/icons/location.png";
import mailIcon from "../../assets/icons/mail2.png";
import phoneIcon from "../../assets/icons/phone-blue.png";
import areaIcon from "../../assets/icons/area.png";
import priceIcon from "../../assets/icons/price.png";
import bathroomIcon from "../../assets/icons/bathroom.png";
import bedroomIcon from "../../assets/icons/bedroom.png";

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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState();
  const dispatch = useDispatch();
  const [pdfPages, setPdfPages] = useState([]);

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
    createPDF,
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
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();

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
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setProperties_Translation([]);
    setErrors({});
    setUnits([]);
    setPaymentPlan([]);
    setPdfScaler(1);
    setPdfLoading(false);
    setEdit(false);
    setSelectedUnit();
  };

  const PageNumber = ({
    flip,
    number,
    bgColor = "bg-white",
    numberColor = "text-black",
  }) => {
    return flip ? (
      <>
        <div className={`absolute bottom-5 w-[95%] h-px ${bgColor}`} />
        <div
          className={`absolute bottom-2.5 right-[5%] h-6 w-6 ${bgColor} ${numberColor} rounded-full text-center font-semibold`}
        >
          <p
            className={`absolute left-1/2 -translate-x-1/2 ${
              pdfLoading ? "-top-2" : "top-0"
            }`}
          >
            {number}
          </p>
        </div>
      </>
    ) : (
      <>
        <div className={`absolute bottom-5 w-[95%] right-0 h-px ${bgColor}`} />
        <div
          className={`absolute bottom-2.5 left-[5%] h-6 w-6 ${bgColor} ${numberColor} rounded-full text-center font-semibold`}
        >
          <p
            className={`absolute left-1/2 -translate-x-1/2 ${
              pdfLoading ? "-top-2" : "top-0"
            }`}
          >
            {number}
          </p>
        </div>
      </>
    );
  };

  async function createPDF() {
    setEdit(false);
    const pdf = new jsPDF("landscape", "pt", "a4");
    setPdfLoading(true);
    for (let i = 0; i < pdfPages.length; i++) {
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
  }
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

  const FirstPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
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
          <p
            className={`font-bold text-med ${
              pdfLoading ? "-translate-y-3" : ""
            }`}
          >
            {
              values?.Property_Translation?.find((x) => x.Language.Code == "En")
                .Name
            }
          </p>
          <p className={`text-small ${pdfLoading ? "-translate-y-3" : ""}`}>
            {
              values?.Developer?.Developer_Translation?.find(
                (x) => x.Language.Code == "En"
              ).Name
            }
            <span className="text-primary"> _____________</span>
          </p>
        </div>
        <div className="absolute right-7 top-1/2 -translate-y-1/2 backdrop-blur-md bg-gray-300/50 rounded-2xl p-8 w-[35%]">
          <p
            className={`text-med font-bold text-[#141330] ${
              pdfLoading ? "-translate-y-3" : ""
            }`}
          >
            {profile.Name}
          </p>
          <div className="grid grid-cols-3 text-white text-tiny mt-4 gap-4">
            <p className={`col-span-1 ${pdfLoading ? "-translate-y-3" : ""}`}>
              Address:
            </p>
            <p className={`col-span-2 ${pdfLoading ? "-translate-y-3" : ""}`}>
              Office 609, Clover Bay Tower - 6a Marasi Dr - Business Bay - Dubai
            </p>
            <p className={`col-span-1 ${pdfLoading ? "-translate-y-3" : ""}`}>
              Email:
            </p>
            <p className={`col-span-2 ${pdfLoading ? "-translate-y-3" : ""}`}>
              info@avarealestate.ae
            </p>
            <p className={`col-span-1 ${pdfLoading ? "-translate-y-3" : ""}`}>
              Phone:
            </p>
            <p className={`col-span-2 ${pdfLoading ? "-translate-y-3" : ""}`}>
              +971501108606
            </p>
          </div>
        </div>
      </div>
    );
  };
  const SecondPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
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
        <PageNumber number={i - 1} key={i} flip={i % 2 == 0} />
      </div>
    );
  };
  const DescriptionPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
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
            <p
              className={`text-med font-bold text-primary ${
                pdfLoading ? "-translate-y-3" : ""
              }`}
            >
              Description
            </p>

            {edit ? (
              properties_Translation.map((item, index) => {
                if (item.Language.Code == "En")
                  return (
                    <div key={index} className="pb-12 -mt-8">
                      <RichTextBox
                        label={`${item.Language.Name} Description`}
                        value={item.Description}
                        error={Boolean(
                          Object.keys(errors).find(
                            (x) => x == "Description" + item.Language.Code
                          )
                        )}
                        onChange={(e) => {
                          e.preventDefault();
                          handleTranslationChange(e, item, "Description", true);
                        }}
                      />
                    </div>
                  );
              })
            ) : (
              <div
                className={`text-white mt-5 overflow-auto ${
                  pdfLoading ? "-translate-y-3" : ""
                }`}
                dangerouslySetInnerHTML={{
                  __html: properties_Translation?.find(
                    (x) => x.Language.Code == "En"
                  )?.Description,
                }}
              />
            )}
          </div>
        </div>

        <PageNumber number={i - 1} key={i} flip={i % 2 == 0} />
      </div>
    );
  };
  const UnitsPage = ({ i, unitsPage, viewTitle }) => {
    return (
      <div
        id={"pdf" + i}
        className={`w-full relative  bg-gray-50 pt-10`}
        style={{
          height: 780 * pdfScaler + "px",
        }}
      >
        {viewTitle && (
          <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
            <div>
              <p
                className={`text-primary text-[40px] font-bold ${
                  pdfLoading ? "-translate-y-2" : "translate-y-0"
                }`}
              >
                Inventory
              </p>
              <div className="w-[100px] h-px bg-white" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-16 m-14 h-full">
          {units.map((item, index) => {
            let condition;
            if (unitsPage == 1) {
              condition = index < 2;
            } else if (unitsPage == 2) {
              condition = index > 1 && index < 4;
            } else if (unitsPage == 3) {
              condition = index > 3 && index < 6;
            }
            if (condition)
              return (
                <div key={index} className="relative">
                  {edit && (
                    <div
                      className="absolute right-6 -top-4 bg-primary w-8 h-8 rounded-full text-white z-10 flex justify-center items-center cursor-pointer"
                      onClick={() => {
                        setSelectedUnit(index);
                      }}
                    >
                      <Edit sx={{ color: "white" }} fontSize="medium" />
                    </div>
                  )}
                  {edit && (
                    <div
                      className="absolute -right-4 -top-4 bg-red-500 w-8 h-8 rounded-full text-white z-10 flex justify-center items-center cursor-pointer"
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
                    >
                      <Delete sx={{ color: "white" }} fontSize="medium" />
                    </div>
                  )}
                  <div className="absolute -top-[30px] -left-[30px] h-[100px] w-[100px] bg-primary p-0.5 z-0">
                    <div className="w-full h-full bg-gray-50" />
                  </div>
                  <div className="bg-[#141330] p-4 flex flex-col justify-start items-center text-white relative min-h-[40%]">
                    <p
                      className={`text-small font-bold ${
                        pdfLoading ? "-translate-y-2" : ""
                      }`}
                    >
                      {item?.Bedrooms > 0
                        ? item?.Bedrooms + " Bedroom"
                        : "Studio"}
                    </p>
                    <div className="grid grid-cols-11 mt-5">
                      <div className="flex gap-x-1 justify-center items-center col-span-3">
                        <img
                          src={bathroomIcon}
                          className="h-6 w-6 scale-150"
                          alt="bathroomIcon"
                        />
                        <p
                          className={`text-[14px] ${
                            pdfLoading ? "-translate-y-2" : ""
                          }`}
                        >
                          {item?.Bathrooms + " Bathrooms"}
                        </p>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="w-px h-full bg-white" />
                      </div>
                      <div className="flex gap-x-1 justify-center items-center col-span-3">
                        <img
                          src={bedroomIcon}
                          className="h-6 w-6 scale-150"
                          alt="bedroomIcon"
                        />
                        <p
                          className={`text-[14px] ${
                            pdfLoading ? "-translate-y-2" : ""
                          }`}
                        >
                          {item?.Bedrooms > 0
                            ? item?.Bedrooms + " Bedroom"
                            : "Studio"}
                        </p>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="w-px h-full bg-white" />
                      </div>
                      <div className="flex gap-x-1 justify-center items-center col-span-3 relative">
                        <img
                          src={areaIcon}
                          className="h-6 w-6 scale-150"
                          alt="areaIcon"
                        />
                        <p
                          className={`text-[14px] ${
                            pdfLoading ? "-translate-y-2" : ""
                          }`}
                        >
                          {item?.Size + " SQ.FT."}
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col justify-center items-center">
                      <div className="space-y-2">
                        <div className="flex gap-x-2 relative">
                          <img
                            src={priceIcon}
                            className="h-6 w-6"
                            alt="priceIcon"
                          />
                          <p
                            className={`${pdfLoading ? "-translate-y-2" : ""}`}
                          >
                            Price Of Unit: {item?.Price}
                          </p>
                        </div>
                        <div className="flex gap-x-2">
                          <img
                            src={priceIcon}
                            className="h-6 w-6 "
                            alt="priceIcon"
                          />
                          <p
                            className={`${pdfLoading ? "-translate-y-2" : ""}`}
                          >
                            {"Price Per SQ.FT.: "}
                            {(item?.Price / item?.Size).toFixed(3)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>{/* {image} */}</div>
                </div>
              );
          })}
        </div>
        <PageNumber
          key={i}
          number={i - 1}
          flip={i % 2 == 0}
          bgColor="bg-[#141330]"
          numberColor="text-white"
        />
      </div>
    );
  };
  const FeaturesPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
        className={`w-full relative  bg-gray-50 pt-10`}
        style={{
          height: 780 * pdfScaler + "px",
        }}
      >
        <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
          <div>
            <p
              className={`text-primary text-[40px] font-bold ${
                pdfLoading ? "-translate-y-3" : "translate-y-0"
              }`}
            >
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
                  className="bg-gray-50 h-[75px] w-[75px] absolute left-[35px] -top-[50px] object-center object-contain"
                />
                <div className="bg-[#141330] pt-8 pb-4 px-4 flex flex-col justify-start items-center w-[150px] h-[150px] text-white">
                  <p
                    className={`font-bold text-smaller text-center ${
                      pdfLoading ? "-translate-y-3" : ""
                    }`}
                  >
                    {
                      item.Aminities_Translation.find(
                        (x) => x.Language.Code == "En"
                      ).Name
                    }
                  </p>
                  <p
                    className={`text-[14px] mt-5 ${
                      pdfLoading ? "-translate-y-3" : ""
                    }`}
                  >
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
        <PageNumber
          key={i}
          number={i - 1}
          flip={i % 2 == 0}
          bgColor="bg-[#141330]"
          numberColor="text-white"
        />
      </div>
    );
  };
  const GalleryPage = ({ i, Images, Design }) => {
    return (
      <div
        id={"pdf" + i}
        className={`w-full relative  bg-gray-50 `}
        style={{
          height: 780 * pdfScaler + "px",
        }}
      >
        <div className="relative p-7">
          <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4 absolute left-7 top-12">
            <div>
              <p
                className={`text-primary text-[40px] font-bold ${
                  pdfLoading ? "-translate-y-3" : "translate-y-0"
                }`}
              >
                Gallery
              </p>
              <div className="w-[100px] h-px bg-white" />
            </div>
          </div>

          {Design ? (
            <div className="grid grid-cols-2 gap-0 place-items-center">
              <div className="w-full flex flex-col">
                {Images?.map((item, index) => {
                  if (index < 2)
                    if (item)
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
                {Images?.map((item, index) => {
                  if (index > 1 && index < 5)
                    if (item)
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
          ) : (
            <div className="grid grid-cols-2 gap-0 place-items-center">
              {Images?.map((item, index) => {
                if (item)
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
          )}
        </div>
        <PageNumber
          key={i}
          number={i - 1}
          flip={i % 2 == 0}
          bgColor="bg-[#141330]"
          numberColor="text-white"
        />
      </div>
    );
  };
  const PaymentPlanPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
        className={`w-full relative  bg-gray-50 pt-10`}
        style={{
          height: 780 * pdfScaler + "px",
        }}
      >
        <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
          <div>
            <p
              className={`text-primary text-[40px] font-bold ${
                pdfLoading ? "-translate-y-3" : "translate-y-0"
              }`}
            >
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              {"On Handover %:  " +
                data?.propertyUnits[0]?.Paymentplan[0]?.OnHandoverPercentage}
            </p>
          </div>
          <div className="flex gap-x-1 justify-start items-center">
            <img
              src={paymentIcon}
              className="w-[50px] h-[50px] scale-150"
              alt="payment5"
            />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
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
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              {"Post Handover No /M: " +
                data?.propertyUnits[0]?.Paymentplan[0]?.NoOfPosthandoverMonths}
            </p>
          </div>
          <div className="flex gap-x-1 justify-start items-center">
            <img
              src={paymentIcon}
              className="w-[50px] h-[50px] scale-150"
              alt="payment5"
            />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              {"Post Handover %: " +
                data?.propertyUnits[0]?.Paymentplan[0]?.PosthandoverPercentage}
            </p>
          </div>
          <div className="flex gap-x-1 justify-start items-center">
            <img
              src={paymentIcon}
              className="w-[50px] h-[50px] scale-150"
              alt="payment5"
            />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              {"Total Installments: " +
                data?.propertyUnits[0]?.Paymentplan[0]?.TotalMonths}
            </p>
          </div>
        </div>
        <PageNumber
          key={i}
          number={i - 1}
          flip={i % 2 == 0}
          bgColor="bg-[#141330]"
          numberColor="text-white"
        />
      </div>
    );
  };
  const InstallmentsPage = ({ i, viewTitle, installments }) => {
    return (
      <div
        id={"pdf" + i}
        className={`w-full relative  bg-gray-50 pt-10`}
        style={{
          height: 780 * pdfScaler + "px",
        }}
      >
        <div className="bg-[#141330] w-[500px] flex  justify-center items-center p-4">
          <div>
            <p
              className={`text-primary text-[40px] font-bold ${
                pdfLoading ? "-translate-y-2" : "translate-y-0"
              }`}
            >
              {viewTitle ? "Installments" : "Installments Cont."}
            </p>
            <div className="w-[100px] h-px bg-white" />
          </div>
        </div>

        <div
          className="m-3 overflow-hidden"
          style={{
            height: 570 * pdfScaler + "px",
          }}
        >
          <table className="w-full">
            <tbody>
              <tr className="border-black/30 border-y-[2px] text-tiny text-center ">
                {/* <th className="p-4 border-black/30 border-y-2">Number</th> */}
                <th className="p-2 lg:p-4 border-black/30 border-y-[2px] sticky -top-1 backdrop-blur-sm">
                  Description
                </th>
                <th className="p-2 lg:p-4 border-black/30 border-y-[2px] sticky -top-1 backdrop-blur-sm">
                  Payment %
                </th>
                {/* <th className="p-2 lg:p-4 border-black/30 border-y-[2px] sticky -top-1 backdrop-blur-sm">
                  Amount
                </th> */}
                <th className="p-2 lg:p-4 border-black/30 border-y-[2px] sticky -top-1 backdrop-blur-sm">
                  Date
                </th>
              </tr>
              {installments?.map((item, index) => {
                if (item)
                  return (
                    <tr
                      key={index}
                      className="border-black/30 border-y-[2px] text-tiny text-center"
                    >
                      {/* <td className="p-4 border-black/30  font-bold">
                    {item.Number}
                  </td> */}
                      <td className={`p-4 border-black/30 border-y-[2px]`}>
                        {
                          item.Installments_Translation.find(
                            (x) => x.Language.Code == "En"
                          ).Description
                        }
                      </td>
                      <td
                        className={`p-4 border-black/30 border-y-[2px] whitespace-nowrap`}
                      >
                        {item.PercentageOfPayment + "%"}
                      </td>
                      {/* <td
                      className={`p-4 border-black/30 border-y-[2px] whitespace-nowrap`}
                    >
                      {(unitPrice / 100) * item.PercentageOfPayment}
                    </td> */}
                      <td
                        className={`p-4 border-black/30 border-y-[2px] whitespace-nowrap`}
                      >
                        {item.Date.split("T")[0]}
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
        <PageNumber
          key={i}
          number={i - 1}
          flip={i % 2 == 0}
          bgColor="bg-[#141330]"
          numberColor="text-white"
        />
      </div>
    );
  };
  const LastPage = ({ i }) => {
    return (
      <div
        id={"pdf" + i}
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

        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 backdrop-blur-md bg-gray-300/50 rounded-2xl p-8 w-[40%]">
          <div className="flex flex-col justify-center items-center py-4">
            <div>
              {/* <p
                className={`text-primary text-[40px] font-bold ${
                  pdfLoading ? "-translate-y-3" : "translate-y-0"
                }`}
              ></p> */}
              <p
                className={`text-med font-bold text-white ${
                  pdfLoading ? "-translate-y-3" : "translate-y-0"
                }`}
              >
                Contact Us
              </p>
              <div className="w-[100px] h-px bg-[#141330]" />
            </div>
          </div>
          <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-start">
            <img src={locationIcon} className="w-8 h-8" alt="locationIcon" />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              Office 609, Clover Bay Tower - 6a Marasi Dr - Business Bay - Dubai
            </p>
          </div>
          <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
            <img src={mailIcon} className="w-8 h-8" alt="locationIcon" />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              info@avarealestate.ae
            </p>
          </div>
          <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
            <img src={phoneIcon} className="w-8 h-8" alt="locationIcon" />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              +971501108606
            </p>
          </div>
          <div className="flex gap-x-2 text-white text-tiny mt-4 gap-4 items-center">
            <img src={websiteIcon} className="w-8 h-8" alt="locationIcon" />
            <p className={`${pdfLoading ? "-translate-y-3" : ""}`}>
              www.avarealestate.ae
            </p>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    let installmentsComponents = [];
    let galleryComponents = [];
    let unitsComponents = [];
    if (units.length > 2) {
      unitsComponents.push(<UnitsPage i={5} unitsPage={2} />);
      if (units.length > 4) {
        unitsComponents.push(<UnitsPage i={6} unitsPage={3} />);
      }
    }
    if (data?.Images.length > 3) {
      galleryComponents.push(
        <GalleryPage
          i={7 + unitsComponents.length}
          Images={[
            data?.Images[3],
            data?.Images[4],
            data?.Images[5],
            data?.Images[6],
            data?.Images[7],
          ]}
          Design
        />
      );
    }
    let instArray = [];
    for (let i = 1; i <= paymentPlan?.Installments?.length; i++) {
      console.log(instArray);
      if (instArray.length < 8) {
        instArray.push(paymentPlan?.Installments[i]);
      } else if (instArray.length == 8) {
        installmentsComponents.push(
          <InstallmentsPage
            i={
              8 +
              unitsComponents.length +
              galleryComponents.length +
              installmentsComponents.length
            }
            viewTitle={i < 10}
            installments={instArray}
          />
        );
        instArray = [];
      }
    }
    let elements = [
      <FirstPage i={1} />,
      <SecondPage i={2} />,
      <DescriptionPage i={3} />,
      <UnitsPage i={4} unitsPage={1} viewTitle={true} />,
      ...unitsComponents,
      <FeaturesPage i={5 + unitsComponents.length} />,
      <GalleryPage
        i={6 + unitsComponents.length}
        Images={[data?.Images[0], data?.Images[1], data?.Images[2]]}
      />,
      ...galleryComponents,
      data?.propertyUnits[0]?.Paymentplan[0] && (
        <PaymentPlanPage
          i={7 + unitsComponents.length + galleryComponents.length}
        />
      ),
      ...installmentsComponents,
      <LastPage i={9 + unitsComponents.length + galleryComponents.length} />,
    ];
    setPdfPages(elements);
  }, [units, drawerID, edit]);

  const PDF = () => {
    return (
      <div className="flex justify-center items-start -mt-8 overflow-auto">
        <div
          className={`space-y-4`}
          style={{
            width: 1024 * pdfScaler + "px",
          }}
        >
          {pdfPages}
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
      onSaveClick={handleSubmit}
      disabled={disabled}
      children={
        isLoading ||
        isFetching ||
        profileIsLoading ||
        profileIsFetching ||
        lngIsLoading ||
        lngIsFethcing ? (
          <div className="flex flex-row justify-center items-center h-screen w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="fixed top-24 left-2 bg-secondary/80 h-[50px] w-[130px] rounded-md shadow-2xl grid grid-cols-4 gap-0 z-40">
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
            {edit && (
              <div
                className="fixed top-24 left-52 bg-secondary/80 h-[50px] w-[50px] rounded-md shadow-2xl z-40 flex justify-center items-center cursor-pointer"
                onClick={() => {
                  // setEdit(!edit);
                  setProperties_Translation(data.Property_Translation);
                  setUnits(data.propertyUnits);
                }}
              >
                <div>
                  <Undo sx={{ color: "rgba(207 165 108)" }} fontSize="large" />
                </div>
              </div>
            )}
            <div
              className="fixed top-24 left-36 bg-secondary/80 h-[50px] w-[50px] rounded-md shadow-2xl z-40 flex justify-center items-center cursor-pointer"
              onClick={() => {
                setEdit(!edit);
              }}
            >
              {edit ? (
                <div className="animate-bounce ">
                  <Close sx={{ color: "rgba(207 165 108)" }} fontSize="large" />
                </div>
              ) : (
                <Edit sx={{ color: "rgba(207 165 108)" }} fontSize="large" />
              )}
            </div>
            {selectedUnit !== undefined && edit && (
              <div className="fixed top-44 left-2 bg-secondary/60 min-h-[200px] w-[300px] rounded-md shadow-2xl px-4 py-8 flex flex-col justify-start items-center space-y-4 z-40">
                <p
                  className={`text-small font-bold ${
                    pdfLoading ? "-translate-y-2" : ""
                  }`}
                >
                  {units[selectedUnit]?.Bedrooms > 0
                    ? units[selectedUnit]?.Bedrooms + " Bedroom"
                    : "Studio"}
                </p>
                <div className="flex bg-white py-2 px-1 rounded-md">
                  <TextField
                    fullWidth
                    type="number"
                    name={"Size"}
                    label={`Size`}
                    id={"Size"}
                    onChange={(e) => {
                      handleUnitsChange(e, "Size", selectedUnit);
                    }}
                    value={units[selectedUnit].Size}
                    variant="outlined"
                    size="medium"
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
                <div className="flex bg-white py-2 px-1 rounded-md">
                  <TextField
                    fullWidth
                    type="number"
                    name={"Price"}
                    label={`Price`}
                    id={"Price"}
                    onChange={(e) => {
                      handleUnitsChange(e, "Price", selectedUnit);
                    }}
                    value={units[selectedUnit].Price}
                    variant="outlined"
                    size="medium"
                    onWheel={(e) => e.target.blur()}
                  />
                </div>
                <div
                  className="bg-primary rounded-md cursor-pointer"
                  onClick={() => setSelectedUnit()}
                >
                  <Done sx={{ color: "white" }} fontSize="large" />
                </div>
              </div>
            )}

            <PDF />
          </div>
        )
      }
    />
  );
};

export default PropertyPDFDrawer;
