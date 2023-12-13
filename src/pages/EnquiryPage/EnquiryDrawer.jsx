import React, { useEffect, useState } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetEnquiryByIdQuery } from "../../redux/enquiry/enquirySlice";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import profilePic from "../../assets/profilepic.png";
import PageModal from "../../components/Admin/layout/PageModal";

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
      <div className="grid md:grid-cols-3 place-items-center p-8 w-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-primary h-[200px] w-[200px]">
            <img
              src={profilePic}
              alt="profile"
              className="object-contain object-center "
            />
          </div>
          <p className="font-bold">{form.Guest?.FullName}</p>
        </div>
        <div className="flex flex-col justify-center space-y-1 col-span-2">
          <p>
            <span className="font-semibold">Email: </span> {form.Guest.Email}
          </p>
          <p>
            <span className="font-semibold">Phone Number: </span>
            {form.Guest.PhoneNo}
          </p>
          <p>
            <span className="font-semibold">Gender: </span> {form.Guest.Gender}
          </p>
          <p>
            <span className="font-semibold">User's IP: </span>
            {form.Guest.IPAddress}
          </p>
        </div>
      </div>
      <div className="p-8 grid md:grid-cols-3 w-full gap-5">
        <p>
          <span className="font-semibold">Purpose: </span> {form.Purpose}
        </p>
        <p>
          <span className="font-semibold">Type: </span> {form.Type}
        </p>

        <p>
          <span className="font-semibold">Bedrooms: </span> {form.Bedrooms}
        </p>
        <p>
          <span className="font-semibold">Minimum Price: </span> {form.PriceMin}
        </p>
        <p>
          <span className="font-semibold">Maximum Price: </span> {form.PriceMax}
        </p>
        <div className="col-span-full">
          <p className="font-semibold">Message: </p>
          <p className="p-2">{form.Message}</p>
        </div>
      </div>
    </div>
  );
  return (
    <PageModal
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
          <div className="text-med">{formElements()}</div>
        )
      }
    />
  );
};

export default EnquiryDrawer;
