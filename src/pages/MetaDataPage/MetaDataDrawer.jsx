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
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
const defaultFormState = {
  id: "",
  Name: "",
  Content: "",
  PropertyID: "",
  ArticleID: "",
  Property: {
    id: "",
    Property_Translation: [{ Language: { Code: "En" }, Name: "" }],
  },
  Article: {
    id: "",
    Articles_Translation: [{ Language: { Code: "En" }, Title: "" }],
  },
};

const MetaDataDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
}) => {
  const [form, setForm] = useState(defaultFormState);
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
        getMetaDataById(drawerID);
        if (isSuccess) {
          setForm(data);
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
            <div className=" flex m-4">
              <Autocomplete
                fullWidth
                disablePortal
                id="ArticleID"
                freeSolo
                value={form.Article}
                onChange={(e, newValue) => {
                  setForm({ ...form, ArticleID: newValue.id });
                }}
                options={articles.normalData}
                getOptionLabel={(option) =>
                  option.Articles_Translation?.find(
                    (x) => x.Language.Code == "En"
                  )?.Title
                }
                filterOptions={createFilterOptions({
                  matchFrom: "start",
                  stringify: (option) =>
                    option.Articles_Translation?.find(
                      (x) => x.Language.Code == "En"
                    )?.Title,
                })}
                renderInput={(params) => (
                  <TextField
                    // fullWidth
                    {...params}
                    type="text"
                    name="ArticleID"
                    label="Article"
                    id="ArticleID"
                  />
                )}
              />
            </div>
          )}
          {propertiesIsSuccess && (
            <div className=" flex m-4">
              <Autocomplete
                fullWidth
                disablePortal
                id="PropertyID"
                freeSolo
                value={form.Property}
                onChange={(e, newValue) => {
                  setForm({ ...form, PropertyID: newValue.id });
                }}
                options={properties.normalData}
                getOptionLabel={(option) =>
                  option.Property_Translation?.find(
                    (x) => x.Language.Code == "En"
                  )?.Name
                }
                filterOptions={createFilterOptions({
                  matchFrom: "start",
                  stringify: (option) =>
                    option.Property_Translation?.find(
                      (x) => x.Language.Code == "En"
                    )?.Name,
                })}
                renderInput={(params) => (
                  <TextField
                    // fullWidth
                    {...params}
                    type="text"
                    name="PropertyID"
                    label="Property"
                    id="PropertyID"
                  />
                )}
              />
            </div>
          )}
        </div>
      </form>
    );
  };
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Meta-data" : form.Name}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={
        form.Name == "" ||
        form.Content == "" ||
        (form.ArticleID == "" && form.PropertyID == "")
      }
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
