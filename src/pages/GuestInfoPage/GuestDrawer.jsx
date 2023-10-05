import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import { useLazyGetGuestByIdQuery } from "../../redux/guestInfo/guestInfo";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
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
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
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
    setCurrentSlide();
  };

  const formRef = useRef(null);

  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="FullName"
              label={`Full Name`}
              id="FullName"
              value={form.FullName}
              variant="outlined"
              size="small"
              required
              disabled
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="Email"
              label={`Email`}
              id="Email"
              value={form.Email}
              variant="outlined"
              size="small"
              required
              disabled
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="PhoneNo"
              label={`Phone No`}
              id="PhoneNo"
              value={form.PhoneNo}
              variant="outlined"
              size="small"
              required
              disabled
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="Gender"
              label={`Gender`}
              id="Gender"
              value={form.Gender}
              variant="outlined"
              size="small"
              required
              disabled
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="IPAddress"
              label={`IP Address`}
              id="IPAddress"
              value={form.IPAddress}
              variant="outlined"
              size="small"
              required
              disabled
            />
          </div>
        </div>
      </form>
    );
  };
  return (
    <PageDrawer
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
