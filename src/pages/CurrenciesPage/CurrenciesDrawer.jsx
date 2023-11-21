import React, { useEffect, useState, useRef } from "react";
import {
  useAddCurrencyMutation,
  useLazyGetCurrencyByIdQuery,
  useUpdateCurrencyMutation,
} from "../../redux/currencies/currenciesSlice";
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
import { showMessage } from "../../redux/messageAction.slice";
import { useDispatch } from "react-redux";
import useForm from "../../hooks/useForm";
const defaultFormState = {
  id: "",
  conversionRate: "",
  ActiveStatus: true,
};

const CurrenciesDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [currency_Translation, setCurrency_Translation] = useState([]);
  const {
    errors,
    handleChange,
    handleSubmit,
    handleTranslationChange,
    setValues,
    values,
    disabled,
    setErrors,
  } = useForm(
    submit,
    defaultFormState,
    currency_Translation,
    setCurrency_Translation
  );
  const sliderRef = useRef();
  const dispatch = useDispatch();
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
    getCurrencyById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetCurrencyByIdQuery();
  const [
    addCurrency,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddCurrencyMutation();
  const [
    updateCurrency,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateCurrencyMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getCurrencyById({ id: drawerID });
        if (isSuccess) {
          setValues(data);
          setCurrency_Translation(data.Currency_Translation);
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
          setCurrency_Translation(translations);
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
    setCurrency_Translation([]);
    setCurrentSlide();
    setErrors({});
  };
  function submit(event) {
    let CT = [];
    for (let i = 0; i < currency_Translation.length; i++) {
      CT.push({
        languagesID: currency_Translation[i].languagesID,
        Name: currency_Translation[i].Name,
      });
    }

    if (drawerID == "") {
      //add
      addCurrency({
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          conversionRate: values.conversionRate,
          Currency_Translation: CT,
        },
      });
    } else {
      //update
      updateCurrency({
        id: drawerID,
        formData: {
          ActiveStatus: `${values.ActiveStatus}`,
          conversionRate: values.conversionRate,
          Currency_Translation: CT,
        },
      });
    }
  }
  const formRef = useRef(null);

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
            />
          </div>
          <div className="m-4 flex">
            <Slider
              dots={false}
              arrows={false}
              infinite={false}
              slidesToShow={lngs.normalData.length ?? 4}
              slidesToScroll={1}
              className="overflow-hidden h-full w-full max-w-[1024px]"
              initialSlide={currentSlide}
            >
              {currency_Translation.map((item, index) => {
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
            ref={sliderRef}
            dots={false}
            touchMove={false}
            swipe={false}
            arrows={false}
            initialSlide={currentSlide}
            infinite={false}
            className="overflow-hidden h-full w-full"
          >
            {currency_Translation.map((item, index) => {
              return (
                <div key={index}>
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
      title={drawerID == "" ? "New Currency" : "Edit Currency"}
      newItem={drawerID == "" && true}
      editable={true}
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

export default CurrenciesDrawer;
