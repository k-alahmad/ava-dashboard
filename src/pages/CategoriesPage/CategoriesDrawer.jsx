import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
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
}) => {
  const [form, setForm] = useState(defaultFormState);

  const [category_Translation, setCategory_Translation] = useState([]);
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
          setForm(data);
          setCategory_Translation(data.Category_Translation);
        }
      } else {
        setForm({ ...defaultFormState, ParentID: parentId });
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
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }
  function handleTranslationChange(e, item, type) {
    setCategory_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Name: type == "Name" ? e.target.value : obj.Name,
            Description:
              type == "Description" ? e.target.value : obj.Description,
          };
        }
        return obj;
      })
    );
  }
  useEffect(() => {
    if (addSuccess || updateSuccess || addIsError || updateIsError) {
      setForm(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess, addIsError, updateIsError]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
  };
  function handleSubmit(event) {
    event.preventDefault();

    let CT = [];
    for (let i = 0; i < category_Translation.length; i++) {
      CT.push({
        languagesID: category_Translation[i].languagesID,
        Name: category_Translation[i].Name,
        Description: category_Translation[i].Description,
      });
    }
    let formData =
      drawerID == ""
        ? {
            ActiveStatus: `${form.ActiveStatus}`,
            Category_Translation: CT,
          }
        : {
            ParentID: drawerID,
            ActiveStatus: `${form.ActiveStatus}`,
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
  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);

  const formElements = () => (
    <form ref={formRef} className="flex flex-col justify-center">
      <div className="py-8 mx-12">
        <div className="w-full flex justify-center items-center">
          <Slider
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
                  className={`max-w-[95%] py-1 px-2 text-center ${
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
          {category_Translation.map((item, index) => {
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
                    required
                  />
                </div>
                <div className="flex m-4">
                  <TextField
                    fullWidth
                    type="text"
                    name={"Description" + item.Language.Code}
                    label={`${item.Language.Name} Description`}
                    id={"Name" + item.Language.Code}
                    onChange={(e) =>
                      handleTranslationChange(e, item, "Description")
                    }
                    value={item.Description}
                    variant="outlined"
                    size="small"
                    required
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
                  value={form.ActiveStatus}
                  checked={form.ActiveStatus}
                />
              }
              label={form.ActiveStatus ? "Active" : "InActive"}
            />
          </FormGroup>
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Category" : "Edit Category"}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Longitude == "" || form.Latitude == "" || form.Latitude == ""
      }
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
