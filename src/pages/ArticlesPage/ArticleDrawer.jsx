import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddArticleMutation,
  useLazyGetArticleByIdQuery,
  useUpdateArticleMutation,
} from "../../redux/articles/articlesSlice";
import Slider from "react-slick";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import { useGetActiveUsersQuery } from "../../redux/users/usersSlice";
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
import Button from "../../components/UI/Button";
import { API_BASE_URL } from "../../constants";
import RichTextBox from "../../components/Forms/RichTextBox";
import useForm from "../../hooks/useForm";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
const defaultFormState = {
  id: "",
  MinRead: "",
  Image: "",
  ActiveStatus: true,
  usersID: "",
};

const ArticleDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [articles_Translation, setArticles_Translation] = useState([]);
  const {
    disabled,
    setErrors,
    errors,
    setValues,
    values,
    handleChange,
    handleSubmit,
    handleTranslationChange,
  } = useForm(
    submit,
    defaultFormState,
    articles_Translation,
    setArticles_Translation
  );
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();
  const [disableField, setDisableField] = useState(false);
  8;
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const sliderRef = useRef();
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  var selectSearchInput = useRef(undefined);
  const [currentSlide, setCurrentSlide] = useState();
  const {
    data: lngs,
    isLoading: lngIsLoading,
    isFetching: lngIsFethcing,
    isSuccess: lngisSuccess,
    isError: lngIsError,
    error: lngError,
  } = useGetLNGQuery();
  const {
    data: users,
    isLoading: usersIsLoading,
    isFetching: usersIsFethcing,
    isSuccess: usersisSuccess,
    isError: usersIsError,
    error: usersError,
  } = useGetActiveUsersQuery();
  const [
    getArticleById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetArticleByIdQuery();
  const [
    addArticle,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddArticleMutation();
  const [
    updateArticle,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateArticleMutation();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getArticleById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.Image?.URL);
          setValues(data);
          setArticles_Translation(data.Articles_Translation);
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
              Title: "",
              Description: "",
              Caption: "",
            });
          });
          setArticles_Translation(translations);
        }
      }
    }
  }, [drawerID, data, lngs, drawerOpen]);

  useEffect(() => {
    if (!image) {
      setImageURL(undefined);
    } else {
      const objectUrl = URL.createObjectURL(image);
      setImageURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);
  function onImageChange(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(undefined);
    }
    setImage(e.target.files[0]);
    setValues({ ...values, Image: e.target.files[0] });
  }

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
    setImage(null);
    setImageURL(null);
    setOldImage(null);
    setArticles_Translation([]);
    setCurrentSlide();
    setErrors({});
  };
  function submit(event) {
    const formData = new FormData();
    formData.append("ActiveStatus", values.ActiveStatus);
    formData.append("MinRead", values.MinRead);
    formData.append("AuthorID", values.usersID);
    if (image) formData.append("Image", image);
    for (let i = 0; i < articles_Translation.length; i++) {
      formData.append(
        `Articles_Translation[${i}][Title]`,
        articles_Translation[i].Title
      );
      formData.append(
        `Articles_Translation[${i}][Description]`,
        articles_Translation[i].Description
      );
      formData.append(
        `Articles_Translation[${i}][Caption]`,
        articles_Translation[i].Caption
      );
      formData.append(
        `Articles_Translation[${i}][languagesID]`,
        articles_Translation[i].languagesID
      );
    }
    if (drawerID == "") {
      //add
      addArticle({ formData });
    } else {
      //update
      updateArticle({ id: drawerID, formData });
    }
  }
  const hiddenFileInput = React.useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    if (profileIsSuccess) {
      if (drawerID !== "") {
        if (
          profile.Role.Role_Resources.find((x) => x.resource.Name == "Article")
            .Update == true
        ) {
          setDisableField(false);
        } else {
          setDisableField(true);
        }
      }
    }
  }, [profileIsSuccess, profile]);
  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
          <div className="flex flex-row items-center justify-center">
            {!disableField && (
              <div className="flex flex-col m-4">
                <Button
                  textColor={"text-white font-regular"}
                  text={"Upload Image"}
                  bgColor={"bg-primary"}
                  customStyle={"py-2 px-4"}
                  onClick={(e) => {
                    e.preventDefault();
                    hiddenFileInput.current.click();
                  }}
                />
                <input
                  type="file"
                  accept="images/*"
                  onChange={onImageChange}
                  style={{ display: "none" }}
                  ref={hiddenFileInput}
                />
              </div>
            )}
            {imageURL && (
              <div className="flex flex-col m-4">
                <p className="text-smaller font-regular pb-1">New image</p>
                <img className="h-[200px] w-[200px] " src={imageURL} alt="" />
              </div>
            )}
            {oldImage && (
              <div className="flex flex-col m-4">
                <p className="text-smaller font-regular pb-1">Current image</p>

                <img
                  className="h-[200px] w-[200px] "
                  src={API_BASE_URL + oldImage}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="number"
              name="MinRead"
              label={`Minutes Of Read`}
              id="MinRead"
              onChange={handleChange}
              value={values.MinRead}
              variant="outlined"
              size="small"
              required
              error={Boolean(errors?.MinRead)}
              helperText={errors?.MinRead}
              disabled={disableField}
            />
          </div>
          {usersisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Author</InputLabel>
                <Select
                  labelId="Author"
                  name="usersID"
                  id="usersID"
                  value={values.usersID}
                  label="Author"
                  onChange={handleChange}
                  MenuProps={{
                    autoFocus: false,
                    style: {
                      maxHeight: "400px",
                    },
                  }}
                  onClose={() => setSelectSearchTerm("")}
                  onAnimationEnd={() => selectSearchInput.current?.focus()}
                  error={Boolean(errors?.usersID)}
                  disabled={disableField}
                >
                  <ListSubheader>
                    <TextField
                      ref={selectSearchInput}
                      fullWidth
                      type="text"
                      name="SelectSearchTerm"
                      placeholder="Search for Author"
                      id="SelectSearchTerm"
                      onChange={(e) => setSelectSearchTerm(e.target.value)}
                      value={selectSearchTerm}
                      variant="outlined"
                      size="small"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          // Prevents autoselecting item while typing (default Select behaviour)
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

                  {users.ids?.map((item, j) => {
                    if (
                      users?.entities[item]?.Name.toLowerCase().includes(
                        selectSearchTerm.toLowerCase()
                      )
                    )
                      return (
                        <MenuItem key={j} value={item}>
                          {users.entities[item].Name}
                        </MenuItem>
                      );
                  })}
                </Select>
                <p className="text-[14px] text-red-600 ml-5">
                  {errors.usersID}
                </p>
              </FormControl>
            </div>
          )}

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
              {articles_Translation.map((item, index) => {
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
            {articles_Translation.map((item, index) => {
              return (
                <div key={index} className="pb-12">
                  <div className="flex m-4">
                    <TextField
                      fullWidth
                      type="text"
                      name={"Title" + item.Language.Code}
                      label={`${item.Language.Name} Title`}
                      id={"Title" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Title")
                      }
                      value={item.Title}
                      variant="outlined"
                      size="small"
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Title" + item.Language.Code
                        )
                      )}
                      helperText={
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Title" + item.Language.Code
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
                      name={"Caption" + item.Language.Code}
                      label={`${item.Language.Name} Caption`}
                      id={"Caption" + item.Language.Code}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Caption")
                      }
                      value={item.Caption}
                      variant="outlined"
                      size="small"
                      required={item.Language.Code == "En"}
                      multiline
                      rows={5}
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Caption" + item.Language.Code
                        )
                      )}
                      helperText={
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Caption" + item.Language.Code
                          )
                        ]
                      }
                      disabled={disableField}
                    />
                  </div>
                  <div>
                    <RichTextBox
                      label={`${item.Language.Name} Body ${
                        item.Language.Code == "En" ? "*" : ""
                      }`}
                      value={item.Description}
                      error={Boolean(
                        Object.keys(errors).find(
                          (x) => x == "Title" + item.Language.Code
                        )
                      )}
                      onChange={(e) =>
                        handleTranslationChange(e, item, "Description", true)
                      }
                      disabled={disableField}
                    />
                    <p className="text-[14px] text-red-600 px-10">
                      {
                        errors[
                          Object.keys(errors).find(
                            (x) => x == "Description" + item.Language.Code
                          )
                        ]
                      }
                    </p>
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
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Article" : values.titleEn}
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

export default ArticleDrawer;
