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
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [articles_Translation, setArticles_Translation] = useState([]);
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
          setForm(data);
          setArticles_Translation(data.Articles_Translation);
        }
      } else {
        setForm(defaultFormState);
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
    setForm({ ...form, Image: e.target.files[0] });
  }
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }
  function handleTranslationChange(e, item, type) {
    // if (drawerID !== "")
    setArticles_Translation((current) =>
      current.map((obj) => {
        if (obj.Language.Code == item.Language.Code) {
          return {
            ...obj,
            Title: type == "Title" ? e.target.value : obj.Title,
            Caption: type == "Caption" ? e.target.value : obj.Caption,
            Description: type == "Desc" ? e : obj.Description,
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
    setImage(null);
    setImageURL(null);
    setOldImage(null);
    setArticles_Translation([]);
    setCurrentSlide();
  };
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("ActiveStatus", form.ActiveStatus);
    formData.append("MinRead", form.MinRead);
    formData.append("AuthorID", form.usersID);
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

  const formElements = () => {
    return (
      <form ref={formRef} className="flex flex-col justify-center">
        <div className="py-1 mx-8">
          <div className="flex flex-row items-center justify-center">
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
              value={form.MinRead}
              variant="outlined"
              size="small"
              required
            />
          </div>
          {usersisSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Author</InputLabel>
                <Select
                  labelId="usersID"
                  name="usersID"
                  id="usersID"
                  value={form.usersID}
                  label="Author"
                  onChange={handleChange}
                  MenuProps={{
                    autoFocus: false,
                    style: {
                      maxHeight: "400px",
                    },
                  }}
                  onClose={() => setSelectSearchTerm("")}
                  // renderValue={() => form.roleID}
                  onAnimationEnd={() => selectSearchInput.current.focus()}
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
                      required={item.Language.Code == "En"}
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
                    />
                  </div>
                  <RichTextBox
                    label={`${item.Language.Name} Body ${
                      item.Language.Code == "En" ? "*" : ""
                    }`}
                    value={item.Description}
                    onChange={(e) => handleTranslationChange(e, item, "Desc")}
                  />
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
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Article" : form.titleEn}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.MinRead.toString().replace(/ /g, "") == "" ||
        form.usersID.replace(/ /g, "") == "" ||
        articles_Translation
          .find((x) => x.Language.Code == "En")
          ?.Title.replace(/ /g, "") == "" ||
        articles_Translation
          .find((x) => x.Language.Code == "En")
          ?.Caption.replace(/ /g, "") == "" ||
        articles_Translation
          .find((x) => x.Language.Code == "En")
          ?.Description.replace(/ /g, "") == "" ||
        image == undefined
      }
      alertMessage={"Required Data Are Missing"}
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
