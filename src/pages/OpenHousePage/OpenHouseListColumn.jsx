import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Full Name",
      id: "FullName",
      accessor: (d) => d.FullName,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Email",
      id: "Email ",
      accessor: (d) => d.Email,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Phone Number",
      id: "PhoneNo",
      accessor: (d) => d.PhoneNo,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Agent",
      id: "Agent",
      accessor: (d) => d.Agent,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },

    {
      Header: "Sent At",
      id: "CreatedAt",
      accessor: (d) => d.CreatedAt?.split("T")[0],
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
      Cell: ({ row }) => (
        <div className="flex items-center">
          <IconButton
            className="p-4"
            onClick={(ev) => onDelete(ev, row.original)}
          >
            <DeleteRoundedIcon color="action" />
          </IconButton>
        </div>
      ),
    },
  ];
};
