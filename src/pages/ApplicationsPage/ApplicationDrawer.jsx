import React, { useEffect, useState } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetApplicationByIdQuery } from "../../redux/applications/applicationsSlice";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";

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
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">FullName: </span> {form.Applicant?.FullName}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Email: </span> {form.Applicant?.Email}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Applicant IP Address: </span>
        {form.Applicant?.IPAddress}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Applicant Phone No: </span>
        {form.Applicant?.PhoneNo}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Applicant Gender: </span>
        {form.Applicant?.Gender}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Years Of Experience: </span>
        {form.YearsOfExp}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Area Specialty: </span>
        {form.AreaSpecialty}
      </div>
      <div className=" border-4 m-4 p-3 w-[95%]">
        <div className="text-4xl">Message: </div>
        <div className="text-2xl">{form.Message}</div>
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">LinkedIn Link: </span>
        {form.LinkedInURL}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Field: </span>
        {form.Field}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">English Level: </span>
        {form.EnglishLvl}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Arabic Level: </span>
        {form.ArabicLvl}
      </div>
      <div className="text-2xl border-4  m-4 p-3 w-[95%]">
        <span className="text-4xl">Other Languages: </span>
        {form.OtherLanguages}
      </div>
    </div>
  );
  return (
    <PageDrawer
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
