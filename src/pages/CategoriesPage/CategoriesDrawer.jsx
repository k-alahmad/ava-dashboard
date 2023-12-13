import React, { useEffect, useState, useRef } from "react";
import {
  useAddCategoryMutation,
  useLazyGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../redux/categories/categoriesSlice";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import Slider from "react-slick";
import { showMessage } from "../../redux/messageAction.slice";
import { useDispatch } from "react-redux";
import PageModal from "../../components/Admin/layout/PageModal";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

const defaultFormState = {
  id: "",
  Category_Translation: [],
  ParentID: null,
  ActiveStatus: true,
  SubCategory: [],
};
const CategoryDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
  parentId,
  parentName,
}) => {
  const [category_Translation, setCategory_Translation] = useState([]);
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
    category_Translation,
    setCategory_Translation
  );
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
    getCategoryById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetCategoryByIdQuery();
  const [
    addCategory,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddCategoryMutation();
  const [
    updateCategory,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateCategoryMutation();
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
        getCategoryById({ id: drawerID });
        if (isSuccess) {
          setValues(data);
          setCategory_Translation(data.Category_Translation);
        }
      } else {
        setValues({ ...defaultFormState, ParentID: parentId });
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
              Description: "",
            });
          });
          setCategory_Translation(translations);
        }
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
    let CT = [];
    for (let i = 0; i < category_Translation.length; i++) {
      CT.push({
        languagesID: category_Translation[i].languagesID,
        Name: category_Translation[i].Name,
        Description: category_Translation[i].Description,
      });
    }
    let formData =
      parentId == ""
        ? {
            ActiveStatus: `${values.ActiveStatus}`,
            Category_Translation: CT,
          }
        : {
            ParentID: parentId,
            ActiveStatus: `${values.ActiveStatus}`,
            Category_Translation: CT,
          };
    if (drawerID == "") {
      //add
      addCategory({
        formData,
      });
    } else {
      //update
      updateCategory({
        id: drawerID,
        formData,
      });
    }
  }
  const formRef = useRef(null);

  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Category")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile, drawerID]);
  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-center">
      <div className="py-8 md:mx-12">
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
            {category_Translation.map((item, index) => {
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
          {category_Translation.map((item, index) => {
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
                    required
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
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name={"Description" + item.Language.Code}
                    label={`${item.Language.Name} Description`}
                    id={"Description" + item.Language.Code}
                    onChange={(e) =>
                      handleTranslationChange(e, item, "Description")
                    }
                    value={item.Description}
                    variant="outlined"
                    size="small"
                    required
                    error={Boolean(
                      Object.keys(errors).find(
                        (x) => x == "Description" + item.Language.Code
                      )
                    )}
                    helperText={
                      errors[
                        Object.keys(errors).find(
                          (x) => x == "Description" + item.Language.Code
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
  return (
    <PageModal
      isOpen={drawerOpen}
      title={
        drawerID == ""
          ? parentName
            ? `Sub-Cateogry for ${parentName}`
            : "New Category"
          : "Edit Category"
      }
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
          <div className="text-med font-light">{formElements()}</div>
        )
      }
    />
  );
};

export default CategoryDrawer;
