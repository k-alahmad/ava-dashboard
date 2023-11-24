import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { API_BASE_URL } from "../../constants";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

export const ComposeColumns = (onDelete) => {
  const { data, isSuccess } = useGetProfileQuery();

  return [
    {
      Header: "Image",
      id: "image",
      accessor: (d) =>
        d?.Image?.URL ? (
          <img
            src={API_BASE_URL + d?.Image?.URL}
            alt={d?.Name}
            className="h-[150px] w-[150px]"
          />
        ) : (
          <div className="h-[150px] w-[150px] border-[1px] border-black flex justify-center items-center">
            <p>No Image</p>
          </div>
        ),
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Name",
      id: "Name",
      accessor: (d) =>
        d.Developer_Translation.find((x) => x.Language.Code == "En").Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "View Tag",
      id: "ViewTag",
      accessor: (d) =>
        d.ViewTag === true ? (
          <div className="text-[green]"> {"Yes"} </div>
        ) : (
          <div className="text-[red]"> {"No"} </div>
        ),
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Created At",
      id: "CreatedAt",
      accessor: (d) => d.CreatedAt.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Updated At",
      id: "UpdatedAt",
      accessor: (d) => d.UpdatedAt.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Active",
      id: "ActiveStatus",
      accessor: (d) =>
        d.ActiveStatus === true ? (
          <div className="text-[green]"> {"Active"} </div>
        ) : (
          <div className="text-[red]"> {"InActive"} </div>
        ),
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },

    {
      Header: "Action",
      id: "action",
      width: 128,
      sortable: false,
      Cell: ({ row }) => {
        if (isSuccess)
          if (
            data?.Role?.Role_Resources?.find(
              (x) => x?.resource?.Name == "Developer"
            )?.Delete == true
          )
            return (
              <div className="flex items-center">
                <IconButton
                  className="p-4"
                  onClick={(ev) => onDelete(ev, row.original)}
                >
                  <DeleteRoundedIcon color="action" />
                </IconButton>
              </div>
            );
      },
    },
  ];
};
