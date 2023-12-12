import React, { useEffect, useState, useRef } from "react";
import { useLazyGetGuestByIdQuery } from "../../redux/guestInfo/guestInfo";
import PageModal from "../../components/Admin/layout/PageModal";
import { CircularProgress, TextField } from "@mui/material";
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
      <div className="flex flex-col justify-center">
        <table className="border-2 border-black/30 py-1 mx-8">
          <tbody>
            <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                Full Name
              </td>
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                {form.FullName}
              </td>
            </tr>
            <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                Email
              </td>
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                {form.Email}
              </td>
            </tr>
            <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                Phone Number
              </td>
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                {form.PhoneNo}
              </td>
            </tr>
            <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                Gender
              </td>
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                {form.Gender}
              </td>
            </tr>
            <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                User IP
              </td>
              <td className="p-2 border-black/30 border-2 font-bold text-start">
                {form.IPAddress}
              </td>
            </tr>
          </tbody>
        </table>

        {/* <div className="py-1 mx-8">
          <div className="flex m-4">
            <p>
              <span className="font-bold">Full Name: </span>
              {form.FullName}
            </p>
          </div>
          <div className="flex m-4">
            <p>
              <span className="font-bold">Email: </span>
              {form.Email}
            </p>
          </div>
          <div className="flex m-4">
            <p>
              <span className="font-bold">Phone Number: </span>
              {form.PhoneNo}
            </p>
          </div>
          <div className="flex m-4">
            <p>
              <span className="font-bold">Gender: </span>
              {form.Gender}
            </p>
          </div>
          <div className="flex m-4">
            <p>
              <span className="font-bold">User IP: </span>
              {form.IPAddress}
            </p>
          </div>
        </div> */}
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
