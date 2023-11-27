import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddPaymentPlanMutation,
  useLazyGetPaymentPlanByIdQuery,
  useUpdatePaymentPlanMutation,
} from "../../redux/paymentPlans/paymentPlansSlice";
import { useGetActivePropertiesQuery } from "../../redux/properties/propertiesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  InputLabel,
  FormControl,
  Select,
  ListSubheader,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
const defaultFormState = {
  DownPayemnt: "",
  DuringConstructionMonths: "",
  DuringConstructionPercentage: "",
  HandoverDate: "",
  NoOfPosthandoverMonths: "",
  OnHandoverPercentage: "",
  Posthandover: false,
  PosthandoverPercentage: "",
  TotalMonths: "",
  propertyID: "",
  Installments: [],
};

const PaymentPlanDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [installments, setInstallments] = useState([]);
  const {
    disabled,
    setErrors,
    errors,
    setValues,
    values,
    handleChange,
    handleSubmit,
    handleInstallmentChange,
    handleTranslationChange,
  } = useForm(
    submit,
    defaultFormState,
    undefined,
    undefined,
    undefined,
    undefined,
    installments,
    setInstallments
  );
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  var selectSearchInput = useRef(undefined);

  const [
    getPaymentPlanById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetPaymentPlanByIdQuery();
  const {
    data: properties,
    isLoading: propertiesIsLoading,
    isFetching: propertiesIsFetching,
    isSuccess: propertiesIsSuccess,
  } = useGetActivePropertiesQuery();
  const [
    addPaymentPlan,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddPaymentPlanMutation();
  const [
    updatePaymentPlan,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdatePaymentPlanMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getPaymentPlanById({ id: drawerID });
        if (isSuccess) {
          setValues(data);
          setInstallments(data.Installments);
        }
      } else {
        setValues(defaultFormState);
      }
    }
  }, [drawerID, data, drawerOpen]);

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
    setErrors({});
  };
  function submit(event) {
    if (drawerID == "") {
      //add
      addPaymentPlan({ formData: values });
    } else {
      console.log({ ...values, Installments: installments });
      //update
      updatePaymentPlan({
        id: drawerID,
        formData: { ...values, Installments: installments },
      });
    }
  }
  const formRef = useRef(null);
  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find(
            (x) => x.resource.Name == "PaymentPlan"
          ).Update == true
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
          <div className="grid grid-cols-3">
            <div className="flex m-4">
              <TextField
                fullWidth
                type="number"
                name="DownPayemnt"
                label={`Down Payemnt`}
                id="DownPayemnt"
                onChange={handleChange}
                value={values.DownPayemnt}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.DownPayemnt)}
                helperText={errors?.DownPayemnt}
                disabled={disableField}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="number"
                name="DuringConstructionMonths"
                label={`During Construction Months`}
                id="DuringConstructionMonths"
                onChange={handleChange}
                value={values.DuringConstructionMonths}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.DuringConstructionMonths)}
                helperText={errors?.DuringConstructionMonths}
                disabled={disableField}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="number"
                name="DuringConstructionPercentage"
                label={`During Construction Percentage`}
                id="DuringConstructionPercentage"
                onChange={handleChange}
                value={values.DuringConstructionPercentage}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.DuringConstructionPercentage)}
                helperText={errors?.DuringConstructionPercentage}
                disabled={disableField}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="date"
                name="HandoverDate"
                label={`Handover Date`}
                id="HandoverDate"
                onChange={handleChange}
                value={values.HandoverDate.split("T")[0]}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.HandoverDate)}
                helperText={errors?.HandoverDate}
                disabled={disableField}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="number"
                name="OnHandoverPercentage"
                label={`On Handover Percentage`}
                id="OnHandoverPercentage"
                onChange={handleChange}
                value={values.OnHandoverPercentage}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.OnHandoverPercentage)}
                helperText={errors?.OnHandoverPercentage}
                disabled={disableField}
              />
            </div>

            {propertiesIsSuccess && (
              <div className="flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Property
                  </InputLabel>
                  <Select
                    labelId="propertyID"
                    name="propertyID"
                    id="propertyID"
                    value={values.propertyID}
                    label="Property"
                    onChange={handleChange}
                    MenuProps={{
                      autoFocus: false,
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    onClose={() => setSelectSearchTerm("")}
                    onAnimationEnd={() => selectSearchInput.current?.focus()}
                  >
                    <ListSubheader>
                      <TextField
                        ref={selectSearchInput}
                        fullWidth
                        type="text"
                        name="SelectSearchTerm"
                        placeholder="Search for Category"
                        id="SelectSearchTerm"
                        onChange={(e) => setSelectSearchTerm(e.target.value)}
                        value={selectSearchTerm}
                        variant="outlined"
                        size="small"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key !== "Escape") {
                            e.stopPropagation();
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </ListSubheader>

                    {properties.ids?.map((item, j) => {
                      if (
                        properties?.entities[item]?.Property_Translation.find(
                          (x) => x.Language.Code == "En"
                        )
                          ?.Name.toLowerCase()
                          .includes(selectSearchTerm.toLowerCase())
                      )
                        return (
                          <MenuItem key={j} value={item}>
                            {
                              properties.entities[
                                item
                              ]?.Property_Translation.find(
                                (x) => x.Language.Code == "En"
                              )?.Name
                            }
                          </MenuItem>
                        );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="flex m-4">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      onChange={handleChange}
                      name="Posthandover"
                      value={values.Posthandover}
                      checked={values.Posthandover}
                    />
                  }
                  label={"PostHandover"}
                />
              </FormGroup>
            </div>
            <div
              className={`flex m-4 ${
                values.Posthandover ? "scale-100" : "scale-0"
              } transition-all duration-300`}
            >
              <TextField
                fullWidth
                type="number"
                name="NoOfPosthandoverMonths"
                label={`Number Of Posthandover Months`}
                id="NoOfPosthandoverMonths"
                onChange={handleChange}
                value={values.NoOfPosthandoverMonths}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.NoOfPosthandoverMonths)}
                helperText={errors?.NoOfPosthandoverMonths}
                disabled={disableField}
              />
            </div>
            <div
              className={`flex m-4 ${
                values.Posthandover ? "scale-100" : "scale-0"
              } transition-all duration-300`}
            >
              <TextField
                fullWidth
                type="number"
                name="PosthandoverPercentage"
                label={`Posthandover Percentage`}
                id="PosthandoverPercentage"
                onChange={handleChange}
                value={values.PosthandoverPercentage}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.PosthandoverPercentage)}
                helperText={errors?.PosthandoverPercentage}
                disabled={disableField}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="number"
                name="TotalMonths"
                label={`Total Months`}
                id="TotalMonths"
                onChange={handleChange}
                value={values.TotalMonths}
                variant="outlined"
                size="medium"
                required
                error={Boolean(errors?.TotalMonths)}
                helperText={errors?.TotalMonths}
                disabled={disableField}
              />
            </div>
          </div>
          {installments.length !== 0 && (
            <div className="p-4 space-y-4 mt-8">
              <p className="font-bold tex-2xl m-4">Installments</p>
              <table className="w-full border-2 border-black/30">
                <tbody>
                  <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
                    <th className="p-2 border-black/30 border-2">Number</th>
                    <th className="p-2 border-black/30 border-2">
                      Description
                    </th>
                    <th className="p-2 border-black/30 border-2">
                      Percentage Of Payment
                    </th>
                    <th className="p-2 border-black/30 border-2">Amount</th>
                    <th className="p-2 border-black/30 border-2">Date</th>
                  </tr>
                  {installments?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-black/30 border-2 text-tiny md:text-smaller text-center"
                      >
                        <td className="p-2 border-black/30 border-2 font-bold text-start">
                          {item.Number}
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          <TextField
                            fullWidth
                            type="text"
                            name={"DescriptionEn"}
                            label={`English Description`}
                            id={"DescriptionEn"}
                            onChange={(e) =>
                              handleInstallmentChange(
                                e,
                                "Description",
                                index,
                                true
                              )
                            }
                            value={
                              item.Installments_Translation.find(
                                (x) => x.Language.Code == "En"
                              )?.Description
                            }
                            variant="outlined"
                            size="medium"
                            required
                            // error={Boolean(errors?.Description)}
                            // helperText={errors?.Description}
                            disabled={disableField}
                            error={Boolean(errors?.Description)}
                            helperText={errors?.Description}
                          />
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          <TextField
                            fullWidth
                            type="number"
                            name={"PercentageOfPayment"}
                            label={`Percentage Of Payment`}
                            id={"PercentageOfPayment"}
                            onChange={(e) =>
                              handleInstallmentChange(
                                e,
                                "PercentageOfPayment",
                                index
                              )
                            }
                            value={item.PercentageOfPayment}
                            variant="outlined"
                            size="medium"
                            required
                            error={Boolean(errors?.PercentageOfPayment)}
                            helperText={errors?.PercentageOfPayment}
                            disabled={disableField}
                          />
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          <TextField
                            fullWidth
                            type="number"
                            name={"Amount"}
                            label={`Amount`}
                            id={"Amount"}
                            onChange={(e) =>
                              handleInstallmentChange(e, "Amount", index)
                            }
                            value={item.Amount}
                            variant="outlined"
                            size="medium"
                            required
                            error={Boolean(errors?.Amount)}
                            helperText={errors?.Amount}
                            disabled={disableField}
                          />
                        </td>
                        <td className={`p-2 border-black/30 border-2`}>
                          <TextField
                            fullWidth
                            type="date"
                            name={"Date"}
                            label={`Date`}
                            id={"Date"}
                            onChange={(e) =>
                              handleInstallmentChange(e, "Date", index)
                            }
                            value={item.Date.split("T")[0]}
                            variant="outlined"
                            size="medium"
                            required
                            error={Boolean(errors?.Date)}
                            helperText={errors?.Date}
                            disabled={disableField}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </form>
    );
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New PaymentPlan" : values.titleEn}
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
        propertiesIsFetching ||
        propertiesIsLoading ? (
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

export default PaymentPlanDrawer;
