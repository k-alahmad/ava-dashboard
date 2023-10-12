import React, { useEffect, useRef, useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/auth/authApiSlice";
import { API_BASE_URL } from "../../constants";
import Button from "../../components/UI/Button";
import { useGetActiveRolesQuery } from "../../redux/roles/rolesSlice";
import { useGetActiveTeamsQuery } from "../../redux/teams/teamsSlice";
import { useLazyGetUserByTeamIdQuery } from "../../redux/users/usersSlice";
import { Edit, Close } from "@mui/icons-material";
import { Gender } from "../../constants";
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
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
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

  const [
    getUserByTeamId,
    {
      data: teamates,
      isLoading: teamatesLoading,
      isSuccess: teamatesSuccess,
      isFetching: teamatesFetching,
      isError: teamatesIsError,
      error: teamatesError,
    },
  ] = useLazyGetUserByTeamIdQuery();
  const [
    updateProfile,
    {
      isSuccess: updateIsSuccess,
      isError: updateIsError,
      error: updateError,
      isLoading: updateLoading,
    },
  ] = useUpdateProfileMutation();
  useEffect(() => {
    if (isSuccess) {
      setForm(data);
      getUserByTeamId({ id: data.teamID });
    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (updateIsSuccess && password !== "") {
      alert("Passowrd Updated");
      setPassword("");
      setPasswordTwo("");
    }
  }, [updateIsSuccess]);
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
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Name", form.Name);
    formData.append("Email", form.Email);
    formData.append("DOB", form.DOB);
    formData.append("Gender", form.Gender);
    formData.append("PhoneNo", form.PhoneNo);
    formData.append("roleID", form.roleID);
    formData.append("teamID", form.teamID);
    formData.append("ActiveStatus", form.ActiveStatus);
    formData.append("Image", form.Image);

    updateProfile({ formData });
    setEdit(false);
  }
  const hiddenFileInput = useRef(null);
  const formRef = useRef(null);
  return (
    isSuccess && (
      <div className="px-[5%] lg:grid lg:grid-cols-3 my-6 gap-4 max-lg:space-y-12 lg:gap-y-8">
        <div className="flex flex-col justify-start items-center">
          <p className="text-secondary text-[35px] text-center my-6 md:my-12 font-bold">
            {data?.Name}'s Profile
          </p>
          <div className="relative h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] bg-secondary/50 rounded-3xl">
            <img
              src={!image ? API_BASE_URL + data?.Image?.URL : imageURL}
              alt={data?.Name}
              className="rounded-3xl shadow-lg drop-shadow-lg object-cover object-center w-full h-full"
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
        <form
          ref={formRef}
          className="flex flex-col justify-center col-span-2 p-4  rounded-md py-3"
        >
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
            <InputLabel id="demo-simple-select-label">Date Of Birth</InputLabel>
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
          <div className=" flex m-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="Gender"
                name="Gender"
                id="Gender"
                value={form.Gender === "" ? "" : form.Gender}
                label="Gender"
                onChange={handleChange}
                MenuProps={{
                  style: {
                    maxHeight: "400px",
                  },
                }}
                disabled={!edit}
              >
                {Gender.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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
                onClick={handleSubmit}
              />
            )}
          </div>
        </form>
        {teamsSuccess && !teamsLoading && !teamsIsFetching && (
          <div className="col-span-1 h-[400px] py-4 px-2 rounded-md overflow-hidden">
            <p className="text-med font-bold p-2">Teammates</p>
            <div className="overflow-y-auto space-y-5 h-full max-h-[90%] px-2">
              {teamates?.ids.map((item, index) => {
                if (item !== data.id)
                  return (
                    <div
                      key={index}
                      className="bg-secondary text-primary rounded-lg backdrop-blur-[50px] shadow-lg drop-shadow-lg min-h-[75px] flex items-center justify-between"
                    >
                      <img
                        src={API_BASE_URL + teamates.entities[item].Image.URL}
                        alt={teamates.entities[item].Name}
                        className="rounded-full h-14 w-14 m-2 object-cover"
                      />
                      <p className="text-smaller px-2">
                        {teamates.entities[item].Name}
                      </p>
                      <p className="text-smaller px-2">
                        {teamates.entities[item].Role.Name}
                      </p>
                    </div>
                  );
              })}
            </div>
          </div>
        )}
        <div className="col-span-1 h-[400px] py-4 px-2 rounded-md overflow-hidden">
          <p className="text-med font-bold p-2">Articles</p>
          <div className="overflow-y-auto space-y-5 h-full max-h-[90%] px-2">
            {data.Articles?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-secondary text-primary rounded-lg backdrop-blur-[50px] shadow-lg drop-shadow-lg min-h-[75px] flex items-center justify-between"
                >
                  <img
                    src={API_BASE_URL + item?.Image?.URL}
                    alt={"article" + index}
                    className="rounded-md h-14 w-14 object-cover"
                  />
                  <p className="text-smaller px-2">
                    {
                      item?.Articles_Translation.find(
                        (x) => x.Language.Code == "En"
                      ).Title
                    }
                  </p>
                  <p className="text-smaller px-2">
                    {"Published: "}
                    {item?.CreatedAt.split("T")[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-1 flex flex-col h-[400px] space-y-5 p-4 rounded-md">
          <p className="text-med font-bold p-2">Change Password</p>
          <div className="flex-1 flex flex-col justify-evenly items-center">
            <div className="flex m-4 w-full">
              <TextField
                fullWidth
                type="password"
                name="Password"
                label="Password"
                id="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                variant="outlined"
                required
                disabled={!edit}
              />
            </div>
            <div className="flex m-4 w-full">
              <TextField
                fullWidth
                type="password"
                name="RePassword"
                label="Re-Type Password"
                id="RePassword"
                onChange={(e) => setPasswordTwo(e.target.value)}
                value={passwordTwo}
                variant="outlined"
                required
                disabled={!edit}
              />
            </div>
            <div className="flex justify-end m-4 w-full">
              <Button
                textColor={"text-white font-regular"}
                text={updateLoading ? "Saving..." : "Save"}
                bgColor={"bg-primary"}
                customStyle={`py-2 px-4 !rounded-xl`}
                disabled={
                  password !== passwordTwo ||
                  password.replace(/ /g, "") == "" ||
                  passwordTwo.replace(/ /g, "") == ""
                }
                onClick={(e) => {
                  updateProfile({
                    id: data.id,
                    formData: { Password: password },
                  }).then(() => {
                    setEdit(false);
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-span-full py-4 px-2 rounded-md">
          <p className="text-med font-bold p-2">Permissions</p>
          <table className="w-full border-2 border-black/30">
            <tbody>
              <tr className="border-black/30 border-2 text-tiny md:text-smaller text-center">
                <th className="p-2 border-black/30 border-2">Name</th>
                <th className="p-2 border-black/30 border-2">READ</th>
                <th className="p-2 border-black/30 border-2">CREATE</th>
                <th className="p-2 border-black/30 border-2">UPDATE</th>
                <th className="p-2 border-black/30 border-2">DELETE</th>
              </tr>
              {data.Role.Role_Resources.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="border-black/30 border-2 text-tiny md:text-smaller text-center"
                  >
                    <td className="p-2 border-black/30 border-2 font-bold text-start">
                      {item.resource?.Name}
                    </td>
                    <td
                      className={`p-2 border-black/30 border-2 ${
                        item.Read ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.Read ? "YES" : "NO"}
                    </td>
                    <td
                      className={`p-2 border-black/30 border-2 ${
                        item.Create ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.Read ? "YES" : "NO"}
                    </td>
                    <td
                      className={`p-2 border-black/30 border-2 ${
                        item.Update ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.Read ? "YES" : "NO"}
                    </td>
                    <td
                      className={`p-2 border-black/30 border-2 ${
                        item.Read ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.Read ? "YES" : "NO"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default ProfilePage;
