import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Guest Name",
      id: "GuestName",
      accessor: (d) => d.Guest.FullName,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Guest Email",
      id: "GuestEmail ",
      accessor: (d) => d.Guest.Email,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Subject",
      id: "Subject",
      accessor: (d) => d.Subject,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Message",
      id: "Message",
      accessor: (d) => d.Message,
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
