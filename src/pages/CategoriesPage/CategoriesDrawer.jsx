import React, { useEffect, useState, useRef } from "react";
import PageDrawer from "../../components/Admin/layout/PageDrawer";
import {
  useAddCategoryMutation,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "../../redux/categories/categoriesSlice";
import Button from "../../components/UI/Button";
import {
  CircularProgress,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { API_BASE_URL } from "../../constants";
const defaultFormState = {
  id: "",
  nameEn: "",
  nameAr: "",
  image: "",
  parentId: null,
  isActive: true,
};
const CategoryDrawer = ({
  drawerOpen,
  setDrawerOpen,
  drawerID,
  setDrawerID,
  parentId,
}) => {
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [oldImage, setOldImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [
    getCategoryById,
    { data, isLoading, isFetching, isError, error, isSuccess },
  ] = useLazyGetCategoryByIdQuery();
  const [addCategory, { isLoading: addLoading, isSuccess: addSuccess }] =
    useAddCategoryMutation();
  const [
    updateCategory,
    { isLoading: updateLoading, isSuccess: updateSuccess },
  ] = useUpdateCategoryMutation();
  useEffect(() => {
    if (drawerOpen) {
      if (drawerID !== "") {
        getCategoryById({ id: drawerID });
        if (isSuccess) {
          setOldImage(data.image?.URL);
          setForm(data);
        }
      } else {
        setForm({ ...defaultFormState, parentId: parentId });
      }
    }
  }, [drawerID, data, drawerOpen]);

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
    setForm({ ...form, image: e.target.files[0] });
  }
  function handleChange(e) {
    if (e.target.name == "dob") {
      setForm({
        ...form,
        dob: e.target.value + "T00:00:00.000Z",
      });
    } else {
      setForm({
        ...form,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });
    }
  }
  useEffect(() => {
    if (addSuccess || updateSuccess) {
      setForm(defaultFormState);
      closeDrawer();
    }
  }, [addSuccess, updateSuccess]);
  const closeDrawer = () => {
    setDrawerID("");
    setDrawerOpen(false);
    setForm(defaultFormState);
    setImage(null);
    setImageURL(null);
    setOldImage(null);
  };
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nameAr", form.nameAr);
    formData.append("nameEn", form.nameEn);
    formData.append("parentId", form.parentId);
    formData.append("isActive", form.isActive);
    formData.append("image", form.image);
    if (drawerID == "") {
      //add
      addCategory({ formData });
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
        <div className="flex flex-row items-center justify-center">
          <div className="flex flex-col m-4">
            <Button
              textColor={"text-white font-medium"}
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
              <p className="text-smaller font-medium pb-1">New image</p>
              <img className="h-[200px] w-[200px] " src={imageURL} alt="" />
            </div>
          )}
          {oldImage && (
            <div className="flex flex-col m-4">
              <p className="text-smaller font-medium pb-1">Current image</p>

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
            type="text"
            name="nameEn"
            label="English Name"
            id="nameEn"
            onChange={handleChange}
            value={form.nameEn}
            variant="outlined"
            size="small"
            required
          />
        </div>
        <div className="flex m-4">
          <TextField
            fullWidth
            type="text"
            name="nameAr"
            label="Arabic Name"
            id="nameAr"
            onChange={handleChange}
            value={form.nameAr}
            variant="outlined"
            size="small"
            required
          />
        </div>

        <div className="flex m-4">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleChange}
                  name="isActive"
                  value={form.isActive}
                  checked={form.isActive}
                />
              }
              label={form.isActive ? "Active" : "InActive"}
            />
          </FormGroup>
        </div>
      </div>
    </form>
  );
  return (
    <PageDrawer
      isOpen={drawerOpen}
      title={drawerID == "" ? "New Category" : form.nameEn}
      newItem={drawerID == "" && true}
      editable={true}
      onCancelClick={closeDrawer}
      onSaveClick={handleSubmit}
      disabled={form.nameAr == "" || form.nameEn == ""}
      children={
        isLoading || addLoading || updateLoading || isFetching ? (
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
