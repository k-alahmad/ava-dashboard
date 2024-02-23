import React, { useEffect, useState } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetApplicationByIdQuery } from "../../redux/applications/applicationsSlice";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import PageModal from "../../components/Admin/layout/PageModal";
import profilePic from "../../assets/profilepic.png";
import { API_BASE_URL } from "../../constants";

const defaultFormState = {
  id: "",
  YearsOfExp: "",
  AreaSpecialty: "",
  Message: "",
  LinkedInURL: "",
  Field: "",
  EnglishLvl: "",
  ArabicLvl: "",
  OtherLanguages: "",
  Job: "",
  Applicant: "",
  CVURL: "",
};
const ApplicationDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);

  const [
    getApplicationById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetApplicationByIdQuery();
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
        getApplicationById({ id: drawerID });
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
          <p className="font-bold">{form.Applicant?.FullName}</p>
        </div>
        <div className="flex flex-col justify-center space-y-1 col-span-2">
          <p>
            <span className="font-semibold">Email: </span>{" "}
            {form.Applicant.Email}
          </p>
          <p>
            <span className="font-semibold">Phone Number: </span>
            {form.Applicant.PhoneNo}
          </p>
          <p>
            <span className="font-semibold">Gender: </span>
            {form.Applicant.Gender}
          </p>
          <p>
            <span className="font-semibold">User's IP: </span>
            {form.Applicant.IPAddress}
          </p>
        </div>
      </div>
      <div className="p-8 grid md:grid-cols-2 w-full gap-5">
        <p>
          <span className="font-semibold">Years Of Experience: </span>{" "}
          {form.YearsOfExp}
        </p>
        <p>
          <span className="font-semibold">Area Specialty: </span>
          {form.AreaSpecialty}
        </p>
        <p className="col-span-2">
          <span className="font-semibold">LinkedIn URL: </span>
          {form.LinkedInURL}
        </p>
        <p>
          <span className="font-semibold">Level Of English: </span>
          {form.EnglishLvl}
        </p>
        <p>
          <span className="font-semibold">Level Of Arabic: </span>
          {form.ArabicLvl}
        </p>
        <p>
          <span className="font-semibold">Other Languages: </span>
          {form.OtherLanguages}
        </p>
        <div className="col-span-full">
          <p className="font-semibold">Message: </p>
          <p className="p-2">{form.Message}</p>
        </div>
        <div className="col-span-full flex justify-center items-center">
          <button
            className="text-small font-bold py-1 px-4 bg-primary rounded-full"
            onClick={() => {
              window.open(
                API_BASE_URL + form.CVURL,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            Download CV
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "" : form.Subject}
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

export default ApplicationDrawer;
