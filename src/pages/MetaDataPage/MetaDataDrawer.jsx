import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddMetaDataMutation,
  useLazyGetMetaDataByIdQuery,
  useUpdateMetaDataMutation,
} from "../../redux/metaData/metaDataSlice";
import { useGetActivePropertiesQuery } from "../../redux/properties/propertiesSlice";
import { useGetActiveArticlesQuery } from "../../redux/articles/articlesSlice";
import {
  CircularProgress,
  TextField,
  InputLabel,
  FormControl,
  Select,
  ListSubheader,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CloseRounded } from "@mui/icons-material";
import PageModal from "../../components/Admin/layout/PageModal";
const defaultFormState = {
  id: "",
  Name: "",
  Content: "",
  PropertyID: "",
  ArticleID: "",
};

const MetaDataDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [selectSearchTerm, setSelectSearchTerm] = useState("");
  var selectSearchInput = useRef(undefined);
  const [
    getMetaDataById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetMetaDataByIdQuery();
  const [
    addMetaData,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: addIsError,
      error: addError,
    },
  ] = useAddMetaDataMutation();
  const [
    updateMetaData,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateMetaDataMutation();

  const {
    data: properties,
    isLoading: propertiesIsLoading,
    isFetching: propertiesIsFetching,
    isSuccess: propertiesIsSuccess,
    isError: propertiesIsError,
    error: propertiesError,
  } = useGetActivePropertiesQuery();
  const {
    data: articles,
    isLoading: articlesIsLoading,
    isFetching: articlesIsFetching,
    isSuccess: articlesIsSuccess,
    isError: articlesIsError,
    error: articlesError,
  } = useGetActiveArticlesQuery();

  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getMetaDataById({ id: drawerID });
        if (isSuccess) {
          setForm({
            ...data,
            ArticleID: data.articlesId,
            PropertyID: data.propertyId,
          });
        }
      } else {
        setForm(defaultFormState);
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

    let data =
      form.PropertyID !== ""
        ? {
            Name: form.Name,
            Content: form.Content,
            PropertyID: form.PropertyID,
          }
        : {
            Name: form.Name,
            Content: form.Content,
            ArticleID: form.ArticleID,
          };

    if (drawerID == "") {
      //add
      addMetaData({
        formData: data,
      });
    } else {
      //update
      updateMetaData({
        id: drawerID,
        formData: data,
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
              type="text"
              name="Name"
              label={`Name`}
              id="Name"
              onChange={handleChange}
              value={form.Name}
              variant="outlined"
              size="small"
              required
            />
          </div>
          <div className="flex m-4">
            <TextField
              fullWidth
              type="text"
              name="Content"
              label={`Content`}
              id="Content"
              onChange={handleChange}
              value={form.Content}
              variant="outlined"
              size="small"
              required
            />
          </div>
          {articlesIsSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Article*</InputLabel>
                <Select
                  labelId="ArticleID"
                  name="ArticleID"
                  id="ArticleID"
                  value={form.ArticleID}
                  disabled={form.PropertyID !== "" && form.PropertyID !== null}
                  label="Article"
                  onChange={handleChange}
                  MenuProps={{
                    autoFocus: false,
                    style: {
                      maxHeight: "400px",
                    },
                  }}
                  onClose={() => setSelectSearchTerm("")}
                  onAnimationEnd={() => selectSearchInput.current?.focus()}
                  {...(form.ArticleID !== "" && {
                    endAdornment: (
                      <div
                        className="!mr-6 !cursor-pointer"
                        onClick={() => setForm({ ...form, ArticleID: "" })}
                      >
                        <CloseRounded />
                      </div>
                    ),
                  })}
                >
                  <ListSubheader>
                    <TextField
                      ref={selectSearchInput}
                      fullWidth
                      type="text"
                      name="SelectSearchTerm"
                      placeholder="Search for Article"
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

                  {articles.ids?.map((item, j) => {
                    if (
                      articles?.entities[item]?.Articles_Translation.find(
                        (x) => x.Language.Code == "En"
                      )
                        ?.Title.toLowerCase()
                        .includes(selectSearchTerm.toLowerCase())
                    )
                      return (
                        <MenuItem key={j} value={item}>
                          {
                            articles.entities[item]?.Articles_Translation.find(
                              (x) => x.Language.Code == "En"
                            )?.Title
                          }
                        </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
            </div>
          )}
          {propertiesIsSuccess && (
            <div className="flex m-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Property*</InputLabel>
                <Select
                  labelId="PropertyID"
                  name="PropertyID"
                  id="PropertyID"
                  disabled={form.ArticleID !== "" && form.ArticleID !== null}
                  value={form.PropertyID}
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
                  {...(form.PropertyID !== "" && {
                    endAdornment: (
                      <div
                        className="!mr-6 !cursor-pointer"
                        onClick={() => setForm({ ...form, PropertyID: "" })}
                      >
                        <CloseRounded />
                      </div>
                    ),
                  })}
                >
                  <ListSubheader>
                    <TextField
                      ref={selectSearchInput}
                      fullWidth
                      type="text"
                      name="SelectSearchTerm"
                      placeholder="Search for Property"
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
        </div>
      </form>
    );
  };
  return (
    <PageModal
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Meta-data" : form.Name}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Name.replace(/ /g, "") == "" ||
        form.Content.replace(/ /g, "") == "" ||
        (form.ArticleID.replace(/ /g, "") == "" &&
          form.PropertyID.replace(/ /g, "") == "")
      }
      alertMessage={"Required Data Are Missing"}
      children={
        isLoading ||
        addLoading ||
        updateLoading ||
        isFetching ||
        propertiesIsFetching ||
        propertiesIsLoading ||
        articlesIsFetching ||
        articlesIsLoading ? (
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

export default MetaDataDrawer;
