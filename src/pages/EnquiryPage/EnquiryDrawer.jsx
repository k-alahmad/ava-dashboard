import React, { useEffect, useState } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetEnquiryByIdQuery } from "../../redux/enquiry/enquirySlice";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";

const defaultFormState = {
  id: "",
  Type: "",
  Purpose: "",
  Bedrooms: "",
  PriceMin: "",
  PriceMax: "",
  Message: "",
  Guest: "",
};
const EnquiryDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);

  const [
    getEnquiryById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetEnquiryByIdQuery();
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
        getEnquiryById({ id: drawerID });
        if (isSuccess) {
          setForm(data);
        }
      }
    }
  }, [drawerID, data, drawerOpen]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
  };
  const formElements = () => (
    <div className="flex flex-col justify-center items-start py-4">
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">FullName: </span> {form.Guest?.FullName}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Email: </span> {form.Guest.Email}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Guest IP Address: </span>
        {form.Guest.IPAddress}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Guest Phone No: </span>
        {form.Guest.PhoneNo}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Guest Gender: </span>
        {form.Guest.Gender}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Type: </span> {form.Type}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Purpose: </span> {form.Purpose}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Bedrooms: </span> {form.Bedrooms}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Price Minimum: </span> {form.PriceMin}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Price Maximum: </span> {form.PriceMax}
      </div>
      <div className=" border-4 m-4 p-3 w-[95%]">
        <div className="text-4xl">Message: </div>
        <div className="text-2xl">{form.Message}</div>
      </div>
    </div>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "" : form.Guest?.FullName}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      children={
        isLoading || isFetching ? (
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

export default EnquiryDrawer;
