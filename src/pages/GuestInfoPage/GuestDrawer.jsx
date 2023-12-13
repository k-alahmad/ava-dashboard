import React, { useEffect, useState, useRef } from "react";
import { useLazyGetGuestByIdQuery } from "../../redux/guestInfo/guestInfo";
import PageModal from "../../components/Admin/layout/PageModal";
import { CircularProgress } from "@mui/material";
import profilePic from "../../assets/profilepic.png";
const defaultFormState = {
  id: "",
  FullName: "",
  Email: "",
  IPAddress: "",
  PhoneNo: "",
  Gender: "",
};

const GuestsDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [form, setForm] = useState(defaultFormState);
  const [
    getGuestById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetGuestByIdQuery();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getGuestById({ id: drawerID });
        if (isSuccess) {
          setForm(data);
        }
      } else {
        setForm(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);

  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
  };

  const formElements = () => {
    return (
      <div className="grid md:grid-cols-3 place-items-center p-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-4 rounded-full bg-primary h-[200px] w-[200px]">
            <img
              src={profilePic}
              alt="profile"
              className="object-contain object-center "
            />
          </div>
          <p className="font-bold">{form.FullName}</p>
        </div>
        <div className="flex flex-col justify-center space-y-1 col-span-2">
          <p>
            <span className="font-semibold">Email: </span> {form.Email}
          </p>
          <p>
            <span className="font-semibold">Phone Number: </span> {form.PhoneNo}
          </p>
          <p>
            <span className="font-semibold">Gender: </span> {form.Gender}
          </p>
          <p>
            <span className="font-semibold">User's IP: </span> {form.IPAddress}
          </p>
        </div>
      </div>
    );
  };
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Guest" : "Edit Guest"}
      newItem={drawerID == "" && true}
      editable={false}
      onCancelClick={closeDrawer}
      //   onSaveClick={handleSubmit}
      drawerH={"h-full"}
      disabled={true}
      children={
        isLoading || isFetching ? (
          <div className="flex flex-row justify-center items-center h-full w-full">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <div className="text-med font-LIT">{formElements()}</div>
        )
      }
    />
  );
};

export default GuestsDrawer;
