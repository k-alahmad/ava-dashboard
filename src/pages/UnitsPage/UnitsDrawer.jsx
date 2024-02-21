import React, { useEffect, useState, useRef } from "react";
import {
  useAddUnitMutation,
  useLazyGetUnitByIdQuery,
  useUpdateUnitMutation,
} from "../../redux/units/unitsSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PageModal from "../../components/Admin/layout/PageModal";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

const defaultFormState = {
  id: "",
  conversionRate: "",
  ActiveStatus: true,
};

const UnitsDrawer = ({ drawerOpen, setDrawerOpen, drawerID, setDrawerID }) => {
  const [unit_Translation, setUnit_Translation] = useState([]);
  const {
    errors,
    handleChange,
    handleSubmit,
    handleTranslationChange,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(submit, defaultFormState, unit_Translation, setUnit_Translation);
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();
  const [
    getUnitById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetUnitByIdQuery();
  const [
    addUnit,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddUnitMutation();
  const [
    updateUnit,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateUnitMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getUnitById({ id: drawerID });
        if (isSuccess) {
          setValues(data);
          setUnit_Translation(data.Unit_Translation);
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
            });
          });
          setUnit_Translation(translations);
        }
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

  useEffect(() => {
    if (addSuccess || updateSuccess || addIsError || updateIsError) {
      setValues(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess, addIsError, updateIsError]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setValues(defaultFormState);
    setUnit_Translation([]);
    setCurrentSlide();
    setErrors({});
  };
  function submit(event) {
    let UT = [];
    for (let i = 0; i < unit_Translation.length; i++) {
      UT.push({
        languagesID: unit_Translation[i].languagesID,
        Name: unit_Translation[i].Name,
      });
    }
    if (drawerID == "") {
      //add
      addUnit({
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          conversionRate: values.conversionRate,
          Unit_Translation: UT,
        },
      });
    } else {
      //update
      updateUnit({
        id: drawerID,
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          conversionRate: values.conversionRate,
          Unit_Translation: UT,
        },
      });
    }
  }
  const formRef = useRef(null);
  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Unit")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile, drawerID]);
  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="conversionRate"
              label={`Conversion Rate`}
              id="conversionRate"
              onChange={handleChange}
              value={values.conversionRate}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.conversionRate)}
              helperText={errors?.conversionRate}
              disabled={disableField}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <Slider
              accessibility={false}
              dots={false}
              arrows={false}
              infinite={false}
              slidesToShow={lngs.normalData.length ?? 4}
              slidesToScroll={1}
              className="overflow-hidden h-full w-full max-w-[1024px]"
              initialSlide={currentSlide}
            >
              {unit_Translation.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`max-w-[95%] py-1 px-2 text-center font-semibold ${
                      currentSlide == item.Language.Code
                        ? "bg-primary text-secondary"
                        : "bg-secondary text-white"
                    } cursor-pointer transition-all duration-500 text-black rounded-md`}
                    onClick={() => {
                      sliderRef.current.slickGoTo(index);
                      setCurrentSlide(item.Language.Code);
                    }}
                  >
                    {item.Language.Name}
                  </div>
                );
              })}
            </Slider>
          </div>
          <Slider
            accessibility={false}
            ref={sliderRef}
            dots={false}
            touchMove={false}
            swipe={false}
            arrows={false}
            initialSlide={currentSlide}
            infinite={false}
            className="overflow-hidden h-full w-full"
          >
            {unit_Translation.map((item, index) => {
              return (
                <div key={index} className="pb-12">
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Name" + item.Language.Code}
                      label={`${item.Language.Name} Name`}
                      id={"Name" + item.Language.Code}
                      onChange={(e) => handleTranslationChange(e, item, "Name")}
                      value={item.Name}
                      variant="outlined"
                      size="small"
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Name" + item.Language.Code
                        )
                      )}
                      helperText={
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Name" + item.Language.Code
                          )
                        ]
                      }
                      disabled={disableField}
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
          <div className="flex m-4">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleChange}
                    name="ActiveStatus"
                    value={values.ActiveStatus}
                    checked={values.ActiveStatus}
                    disabled={disableField}
                  />
                }
                label={values.ActiveStatus ? "Active" : "InActive"}
              />
            </FormGroup>
          </div>
        </div>
      </form>
    );
  };
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Unit" : "Edit Unit"}
      newItem={drawerID == "" && true}
      editable={!disableField}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={disabled}
      children={
        isLoading ||
        addLoading ||
        updateLoading ||
        isFetching ||
        lngIsLoading ||
        lngIsFethcing ? (
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

export default UnitsDrawer;
