import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Download } from "@mui/icons-material";
export const ComposeColumns = (onDelete, onDownload) => {
  return [
    {
      Header: "Name",
      id: "Name",
      accessor: (d) =>
        d.Property_Translation.find((x) => x.Language.Code == "En").Name,
      className: "font-bold",
      sortable: true,
      show: true,
      checked: true,
      lockToggle: true,
      hover: true,
    },
    {
      Header: "Handover",
      id: "Handover",
      accessor: (d) => d.Handover,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Furnishing Status",
      id: "FurnishingStatus",
      accessor: (d) => d.FurnishingStatus,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Vacant Status",
      id: "VacantStatus",
      accessor: (d) => d.VacantStatus,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Purpose",
      id: "Purpose",
      accessor: (d) => d.Purpose,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Category",
      id: "categoryId",
      accessor: (d) =>
        d.Category?.Category_Translation?.find((x) => x.Language.Code == "En")
          .Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Developer",
      id: "developerId",
      accessor: (d) =>
        d.Developer?.Developer_Translation?.find((x) => x.Language.Code == "En")
          .Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Address",
      id: "Address",
      accessor: (d) =>
        d.Address?.Address_Translation?.find((x) => x.Language.Code == "En")
          .Name,
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
      width: 300,
      sortable: false,
      Cell: ({ row }) => (
        <div className="flex items-center z-40">
          <IconButton
            className="p-4"
            onClick={(ev) => onDownload(ev, row.original)}
          >
            <Download color="action" />
          </IconButton>
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
