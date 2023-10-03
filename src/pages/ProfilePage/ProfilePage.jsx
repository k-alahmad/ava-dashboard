import React, { useEffect, useRef, useState } from "react";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import { API_BASE_URL } from "../../constants";
import Button from "../../components/UI/Button";
import { useGetActiveRolesQuery } from "../../redux/roles/rolesSlice";
import { useGetActiveTeamsQuery } from "../../redux/teams/teamsSlice";
import { Edit, Close } from "@mui/icons-material";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
const defaultFormState = {
  id: "",
  Name: "",
  Email: "",
  DOB: "",
  Password: "",
  PhoneNo: "",
  Gender: "",
  roleID: "",
  teamID: "",
  ActiveStatus: true,
  Image: "",
};
const ProfilePage = () => {
  const { data, isSuccess } = useGetProfileQuery();
  const [form, setForm] = useState(defaultFormState);
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [edit, setEdit] = useState(false);
  const {
    data: roles,
    isLoading: rolesLoading,
    isSuccess: rolesSuccess,
    isFetching: rolesIsFetching,
  } = useGetActiveRolesQuery();
  const {
    data: teams,
    isLoading: teamsLoading,
    isSuccess: teamsSuccess,
    isFetching: teamsIsFetching,
  } = useGetActiveTeamsQuery();
  useEffect(() => {
    isSuccess && setForm(data);
  }, [isSuccess]);
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
    if (e.target.name == "DOB") {
      setForm({
        ...form,
        DOB: e.target.value + "T00:00:00.000Z",
      });
    } else {
      setForm({
        ...form,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });
    }
  }
  const hiddenFileInput = useRef(null);
  const formRef = useRef(null);
  return (
    isSuccess && (
      <div className="px-[5%] grid md:grid-cols-3 mt-6">
        <div className="flex flex-col justify-center items-center ">
          <div className="relative h-[350px] w-[350px]">
            <img
              src={!image ? API_BASE_URL + "/" + data?.Image?.URL : imageURL}
              alt={data?.Name}
              className="rounded-3xl object-cover object-center w-full h-full"
            />
            {imageURL && (
              <div
                className="absolute font-bold text-med top-5 right-5 cursor-pointer"
                onClick={() => {
                  setImageURL(null);
                  setImage(null);
                }}
              >
                <Close
                  color="action"
                  className="bg-primary rounded-full p-1"
                  fontSize="large"
                />
              </div>
            )}
          </div>
          <div className="h-[55px]">
            {edit && (
              <div className="flex flex-col m-4">
                <Button
                  textColor={"text-white font-regular"}
                  text={"Upload Image"}
                  bgColor={"bg-primary "}
                  customStyle={"py-2 px-4 !rounded-xl"}
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
          </div>
        </div>

        <form ref={formRef} className="flex flex-col justify-center col-span-2">
          <div className="py-8 mx-12">
            <div className="flex m-4 font-bold text-med justify-between items-center">
              <p>Profile Information</p>
              <div className="cursor-pointer" onClick={() => setEdit(!edit)}>
                {edit ? (
                  <Close
                    color="action"
                    className="bg-primary rounded-full p-1"
                    fontSize="large"
                  />
                ) : (
                  <Edit
                    color="action"
                    className="bg-primary rounded-full p-1"
                    fontSize="large"
                  />
                )}
              </div>
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="text"
                name="Name"
                label="Name"
                id="Name"
                onChange={handleChange}
                value={form.Name === "" ? "" : form.Name}
                variant="outlined"
                required
                disabled={!edit}
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="text"
                name="Email"
                label="Email"
                id="Email"
                onChange={handleChange}
                value={form.Email === "" ? "" : form.Email}
                variant="outlined"
                required
                disabled
              />
            </div>
            <div className="flex m-4">
              <TextField
                fullWidth
                type="text"
                name="PhoneNo"
                label="Phone Number"
                id="PhoneNo"
                onChange={handleChange}
                value={form.PhoneNo === "" ? "" : form.PhoneNo}
                variant="outlined"
                required
                disabled={!edit}
              />
            </div>
            <div className=" m-4">
              <InputLabel id="demo-simple-select-label">
                Date Of Birth
              </InputLabel>
              <TextField
                fullWidth
                type="date"
                name="DOB"
                id="DOB"
                onChange={handleChange}
                value={
                  form.DOB?.split("T")[0] === "" ? "" : form.DOB?.split("T")[0]
                }
                variant="outlined"
                disabled={!edit}
              />
            </div>
            {rolesSuccess && (
              <div className=" flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="Role"
                    name="roleID"
                    id="roleID"
                    value={form.roleID === "" ? "" : form.roleID}
                    label="Role"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={!edit}
                  >
                    {roles?.ids.map((item) => {
                      return (
                        <MenuItem key={item} value={item}>
                          {roles.entities[item].Name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}
            {teamsSuccess && (
              <div className=" flex m-4">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Team</InputLabel>
                  <Select
                    labelId="Team"
                    name="teamID"
                    id="teamID"
                    value={form.teamID === "" ? "" : form.teamID}
                    label="Team"
                    onChange={handleChange}
                    MenuProps={{
                      style: {
                        maxHeight: "400px",
                      },
                    }}
                    disabled={!edit}
                  >
                    {teams?.ids.map((item) => {
                      return (
                        <MenuItem key={item} value={item}>
                          {teams.entities[item].Title}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="flex m-4 !h-[55px]">
              {edit && (
                <Button
                  textColor={"text-white font-regular"}
                  text={"Save"}
                  bgColor={"bg-primary "}
                  customStyle={`py-2 px-4 !rounded-xl `}
                  onClick={(e) => {
                    setEdit(false);
                  }}
                />
              )}
            </div>
          </div>
        </form>
      </div>
    )
  );
};

export default ProfilePage;
