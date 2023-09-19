import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { FormGroup, Switch, FormControlLabel } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useUpdateRoleResourcesByRoleIdMutation } from "../../redux/roles/rolesSlice";
const RoleResourceController = ({
  id,
  RoleResources,
  changeResourceSettings,
}) => {
  const [open, setOpen] = useState(false);
  const [
    updateRoleResourcesByRoleId,
    { isLoading, isSuccess, isError, error },
  ] = useUpdateRoleResourcesByRoleIdMutation();
  return (
    <div className="space-y-4">
      <button
        className="font-bold text-4xl cursor-pointer relative z-10 py-3 bg-white w-full text-start"
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        Permissions
        {open ? (
          <ArrowDropDown fontSize="large" />
        ) : (
          <ArrowDropUp fontSize="large" />
        )}
      </button>

      <div
        className={`${
          open
            ? "scale-y-100 translate-y-0 h-full"
            : "scale-y-0 -translate-y-[7%] h-0"
        } origin-top transition-all duration-500 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-1 gap-y-5`}
      >
        {RoleResources?.map((item, index) => {
          return (
            <FormGroup key={index} className="space-y-2">
              <p className="text-2xl font-semibold">{item.resource.Name}</p>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => changeResourceSettings(e, item, "Read")}
                    name={item.resource.Name + "Read"}
                    value={item.Read}
                    checked={item.Read}
                  />
                }
                label={"Read"}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => changeResourceSettings(e, item, "Create")}
                    name={item.resource.Name + "Create"}
                    value={item.Create}
                    checked={item.Create}
                  />
                }
                label={"Create"}
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => changeResourceSettings(e, item, "Update")}
                    name={item.resource.Name + "Update"}
                    value={item.Update}
                    checked={item.Update}
                  />
                }
                label={"Update"}
              />

              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => changeResourceSettings(e, item, "Delete")}
                    name={item.resource.Name + "Delete"}
                    value={item.Delete}
                    checked={item.Delete}
                  />
                }
                label={"Delete"}
              />
            </FormGroup>
          );
        })}
        <Button
          textColor={"text-white font-medium"}
          text={"Save"}
          bgColor={"bg-secondary"}
          customStyle={"pb-3 px-4 !h-[50px] self-end"}
          onClick={(e) => {
            e.preventDefault();
            updateRoleResourcesByRoleId({
              id: id,
              Role_Resources: RoleResources,
            });
          }}
        />
      </div>
    </div>
  );
};

export default RoleResourceController;
