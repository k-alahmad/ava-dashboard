import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Name",
      id: "Name",
      accessor: (d) => d.Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Content",
      id: "Content",
      accessor: (d) => d.Content,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Property",
      id: "Property",
      accessor: (d) =>
        d.Property?.Property_Translation.find((x) => x.Language.Code == "En")
          .Name ?? "-",
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Article",
      id: "Article",
      accessor: (d) =>
        d.Article?.Articles_Translation.find((x) => x.Language.Code == "En")
          .Title ?? "-",
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
