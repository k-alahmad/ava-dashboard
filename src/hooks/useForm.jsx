import { useEffect, useState } from "react";
import { omit } from "lodash";
import { useDispatch } from "react-redux";
import { showMessage } from "../redux/messageAction.slice";
const useForm = (
  callback,
  defaultValues,
  translation,
  setTranslation,
  units,
  setUnits,
  installments,
  setInstallments
) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const validate = (name, value) => {
    if (name == "Name") {
      if (value.length <= 4) {
        setErrors({
          ...errors,
          Name: "Username atleast have 5 letters",
        });
      } else {
        let newObj = omit(errors, "Name");
        setErrors(newObj);
      }
    } else if (name == "Title") {
      if (value.length <= 3) {
        setErrors({
          ...errors,
          Title: "Title atleast have 4 letters",
        });
      } else {
        let newObj = omit(errors, "Title");
        setErrors(newObj);
      }
    } else if (name == "Code") {
      if (value.length <= 1) {
        setErrors({
          ...errors,
          Code: "Title atleast have 2 letters",
        });
      } else {
        let newObj = omit(errors, "Code");
        setErrors(newObj);
      }
    } else if (name == "BRNNo") {
      if (value.length < 4) {
        setErrors({
          ...errors,
          BRNNo: "BRN Number atleast have 4 letters",
        });
      } else {
        let newObj = omit(errors, "BRNNo");
        setErrors(newObj);
      }
    } else if (name == "ReraNo") {
      if (value.length < 4) {
        setErrors({
          ...errors,
          ReraNo: "Rera Number atleast have 4 letters",
        });
      } else {
        let newObj = omit(errors, "ReraNo");
        setErrors(newObj);
      }
    } else if (name == "Bedrooms") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          Bedrooms: "Bedrooms is Required",
        });
      } else {
        let newObj = omit(errors, "Bedrooms");
        setErrors(newObj);
      }
    } else if (name == "Price") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          Price: "Price is Required",
        });
      } else {
        let newObj = omit(errors, "Price");
        setErrors(newObj);
      }
    } else if (name == "Price") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          Price: "Price is Required",
        });
      } else {
        let newObj = omit(errors, "Price");
        setErrors(newObj);
      }
    } else if (name == "BalconySize" && values.Bacloney == true) {
      if (value.length < 1) {
        setErrors({
          ...errors,
          BalconySize: "Balcony Size is Required",
        });
      } else {
        let newObj = omit(errors, "BalconySize");
        setErrors(newObj);
      }
    } else if (name == "Size") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          Size: "Size is Required",
        });
      } else {
        let newObj = omit(errors, "Size");
        setErrors(newObj);
      }
    } else if (name == "PricePerSQFT") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          PricePerSQFT: "Price Per SQFT is Required",
        });
      } else {
        let newObj = omit(errors, "PricePerSQFT");
        setErrors(newObj);
      }
    } else if (name == "CategoryID") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          CategoryID: "Category is Required",
        });
      } else {
        let newObj = omit(errors, "CategoryID");
        setErrors(newObj);
      }
    } else if (name == "DEDNo") {
      if (value.length < 4) {
        setErrors({
          ...errors,
          DEDNo: "DED Number is atleast 4 charecters",
        });
      } else {
        let newObj = omit(errors, "DEDNo");
        setErrors(newObj);
      }
    } else if (name == "DeveloperID") {
      if (value.length < 4) {
        setErrors({
          ...errors,
          DeveloperID: "Developer is Required",
        });
      } else {
        let newObj = omit(errors, "DeveloperID");
        setErrors(newObj);
      }
    } else if (name == "EstimatedRent") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          EstimatedRent: "Estimated Rent is Required",
        });
      } else {
        let newObj = omit(errors, "EstimatedRent");
        setErrors(newObj);
      }
    } else if (name == "conversionRate") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          conversionRate: "Conversion rate is required",
        });
      } else {
        let newObj = omit(errors, "conversionRate");
        setErrors(newObj);
      }
    } else if (name == "PermitNumber") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          PermitNumber: "Permit Number rate is required",
        });
      } else {
        let newObj = omit(errors, "PermitNumber");
        setErrors(newObj);
      }
    } else if (name == "RentMax") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          RentMax: "Maximum number of checks is required",
        });
      } else {
        let newObj = omit(errors, "RentMax");
        setErrors(newObj);
      }
    } else if (name == "RentMin") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          RentMin: "Minimum number of checks is required",
        });
      } else {
        let newObj = omit(errors, "RentMin");
        setErrors(newObj);
      }
    } else if (name == "Bathrooms") {
      if (value.length < 1) {
        setErrors({
          ...errors,
          Bathrooms: "Bathrooms is required",
        });
      } else {
        let newObj = omit(errors, "Bathrooms");
        setErrors(newObj);
      }
    } else if (name == "PhoneNo") {
      if (value.length <= 10) {
        setErrors({
          ...errors,
          PhoneNo: "Phone number is not valid",
        });
      } else {
        let newObj = omit(errors, "PhoneNo");
        setErrors(newObj);
      }
    } else if (name == "Latitude") {
      let numVal = parseFloat(value);
      if (numVal < -90 || numVal > 90) {
        setErrors({
          ...errors,
          Latitude: "Must be between '-90' and '90'",
        });
      } else {
        let newObj = omit(errors, "Latitude");
        setErrors(newObj);
      }
    } else if (name == "Longitude") {
      let numVal = parseFloat(value);
      if (numVal < -180 || numVal > 180) {
        setErrors({
          ...errors,
          Longitude: "Must be between '-180' and '180'",
        });
      } else {
        let newObj = omit(errors, "Longitude");
        setErrors(newObj);
      }
    } else if (name == "Email") {
      if (
        !new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ).test(value)
      ) {
        setErrors({
          ...errors,
          Email: "Enter a valid email address",
        });
      } else {
        let newObj = omit(errors, "Email");
        setErrors(newObj);
      }
    } else if (name == "Password") {
      if (
        !new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).test(value)
      ) {
        setErrors({
          ...errors,
          Password:
            "Password should contains atleast 8 charaters and containing uppercase, lowercase and numbers",
        });
      } else {
        let newObj = omit(errors, "Password");
        setErrors(newObj);
      }
    }
  };
  const handleChange = (event) => {
    // event.persist();
    // let type = event.target.type;
    let name = event.target.name;
    let val;

    if (name == "DOB" || name == "HandoverDate") {
      val = event.target.value + "T00:00:00.000Z";
    } else if (event.target.type == "checkbox") {
      val = event.target.checked;
    } else {
      val = event.target.value;
    }

    validate(name, val);
    setValues({
      ...values,
      [name]: val,
    });
  };
  function handleTranslationChange(e, item, type, rich) {
    let val = rich ? e : e.target.value;
    // let name = e.target.name;
    if (item.Language.Code == "En") {
      if (val.length == 0 && type !== "ButtonName") {
        setErrors({ ...errors, [type + "En"]: "this field is required" });
      } else {
        let newObj = omit(errors, `${type}En`);
        setErrors(newObj);
      }
    }

    setTranslation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            [type]: val,
          };
        }
        return obj;
      })
    );
  }
  function handleInstallmentChange(e, type, index, insideTranslation) {
    let val;
    if (e.target.type == "checkbox") {
      val = e.target.checked;
    } else {
      val = e.target.value;
    }

    if (val.length == 0) {
      setErrors({
        ...errors,
        [type]: "this field is required",
      });
    } else {
      let newObj = omit(errors, `${type}`);
      setErrors(newObj);
    }
    setInstallments((current) =>
      current.map((obj, i) => {
        if (i == index) {
          if (insideTranslation) {
            let it = obj.Installments_Translation;
            let filteredIT = [...it.filter((x) => x.Language.Code !== "En")];
            let ENOBJ = { ...it.find((x) => x.Language.Code == "En") };
            ENOBJ.Description = val;

            return {
              ...obj,
              Installments_Translation: [...filteredIT, ENOBJ],
            };
          } else {
            return {
              ...obj,
              [type]: val,
            };
          }
        }
        return obj;
      })
    );
  }
  function handleUnitsChange(e, type, index) {
    let val;
    if (e.target.type == "checkbox") {
      val = e.target.checked;
    } else {
      val = e.target.value;
    }

    if (val.length == 0) {
      setErrors({
        ...errors,
        [type]: "this field is required",
      });
    } else {
      let newObj = omit(errors, `${type}`);
      setErrors(newObj);
    }
    setUnits((current) =>
      current.map((obj, i) => {
        if (i == index) {
          return {
            ...obj,
            [type]: val,
          };
        }
        return obj;
      })
    );
  }
  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    let theErrors = { ...errors };
    if (translation) {
      translation?.map((item) => {
        if (item.Language.Code == "En") {
          if (item?.Name?.replace(/ /g, "") == "") {
            theErrors = { ...theErrors, NameEn: "this field is required" };
          }
          if (item?.Description?.replace(/ /g, "") == "") {
            theErrors = {
              ...theErrors,
              DescriptionEn: "this field is required",
            };
          }
          if (item?.Title?.replace(/ /g, "") == "") {
            theErrors = { ...theErrors, TitleEn: "this field is required" };
          }
          if (item?.Caption?.replace(/ /g, "") == "") {
            theErrors = { ...theErrors, CaptionEn: "this field is required" };
          }
        }
      });
    }
    Object.keys(values).map((item) => {
      if (
        typeof values[item] == "string" &&
        values[item].length == 0 &&
        item !== "id" &&
        item !== "Image" &&
        item !== "AddressID"
      ) {
        theErrors = { ...theErrors, [item]: item + " is required" };
      }
    });
    setErrors(theErrors);
    if (
      Object.keys(errors).length === 0 &&
      Object.keys(values).length !== 0 &&
      Object.keys(theErrors).length === 0
    ) {
      callback();
    } else {
      console.log(errors);
      dispatch(
        showMessage({
          message: "Please fill the required fields",
          variant: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && Object.keys(values).length !== 0)
      setDisabled(false);
    else setDisabled(true);
  }, [Object.keys(values).length, Object.keys(errors).length]);

  return {
    disabled,
    values,
    setValues,
    errors,
    handleChange,
    handleSubmit,
    handleTranslationChange,
    handleUnitsChange,
    handleInstallmentChange,
    setErrors,
  };
};

export default useForm;
