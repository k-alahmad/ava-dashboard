import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Down Payemnt",
      id: "DownPayemnt",
      accessor: (d) => d.DownPayemnt,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "During Construction Months",
      id: "DuringConstructionMonths ",
      accessor: (d) => d.DuringConstructionMonths,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "During Construction Percentage",
      id: "DuringConstructionPercentage",
      accessor: (d) => d.DuringConstructionPercentage,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Handover Date",
      id: "HandoverDate",
      accessor: (d) => d.HandoverDate.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Posthandover",
      id: "Posthandover",
      accessor: (d) => (d.Posthandover ? "YES" : "NO"),
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Installments",
      id: "Installments",
      accessor: (d) => d.Installments?.length,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
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
