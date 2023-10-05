import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export const ComposeColumns = (onDelete) => {
  return [
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
      Header: "Code",
      id: "Code",
      accessor: (d) => d.Code,
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
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
          </div>
        );
      },
    },
  ];
};