import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LockResetIcon from "@mui/icons-material/LockReset";
import { API_BASE_URL } from "../../constants";

export const ComposeColumns = (onDelete, onChangePassowrd) => {
  return [
    {
      Header: "Image",
      id: "Image",
      accessor: (d) =>
        d?.Image?.URL ? (
          <img
            src={`${API_BASE_URL}/${d?.Image?.URL}`}
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
      accessor: (d) => d.Name,
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Email",
      id: "Email",
      accessor: (d) => d.Email,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Date Of Birth",
      id: "DOB",
      accessor: (d) => d.DOB.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: false,
    },
    {
      Header: "Phone Number",
      id: "PhoneNo",
      accessor: (d) => d.PhoneNo,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: false,
    },
    {
      Header: "Role",
      id: "Role",
      accessor: (d) => d.Role.Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Created At",
      id: "CreatedAt",
      accessor: (d) => d?.CreatedAt?.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Updated At",
      id: "UpdatedAt",
      accessor: (d) => d?.UpdatedAt?.split("T")[0],
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
        return (
          <div className="flex items-center">
            <IconButton
              className="p-4"
              onClick={(ev) => onDelete(ev, row.original)}
            >
              <DeleteRoundedIcon color="action" />
            </IconButton>
            <IconButton
              className="p-4"
              onClick={(ev) => onChangePassowrd(ev, row.original)}
            >
              <LockResetIcon color="action" />
            </IconButton>
          </div>
        );
      },
    },
  ];
};
