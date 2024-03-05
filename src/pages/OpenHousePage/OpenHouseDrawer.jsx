import React, { useEffect, useState } from "react";
import { useLazyGetOpenHouseByIdQuery } from "../../redux/openHouse/openHouseSlice";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { showMessage } from "../../redux/messageAction.slice";
import PageModal from "../../components/Admin/layout/PageModal";
import profilePic from "../../assets/profilepic.png";
const defaultFormState = {
  id: "",
  FullName: "",
  PhoneNo: "",
  Email: "",
  Agent: "",
};
const OpenHouseDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);

  const [
    getOpenHouseById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetOpenHouseByIdQuery();
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
        getOpenHouseById({ id: drawerID });
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
            <span className="font-semibold">Phone Number: </span>
            {form.PhoneNo}
          </p>
          <p>
            <span className="font-semibold">Agent: </span> {form.Agent}
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "" : form.Subject}
      newItem={false}
      editable={false}
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

export default OpenHouseDrawer;
