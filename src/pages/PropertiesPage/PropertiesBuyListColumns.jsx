import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Name",
      id: "Name",
      accessor: (d) =>
        d.Property_Translation.find((x) => x.Language.Code == "En").Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
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
      Header: "Completion Status",
      id: "CompletionStatus",
      accessor: (d) => d.CompletionStatus,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Vacant Status",
      id: "VacantStatus",
      accessor: (d) => (d.CompletionStatus == "Ready" ? d.VacantStatus : "-"),
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
      id: "addressId",
      accessor: (d) =>
        d.Address?.Address_Translation?.find((x) => x.Language.Code == "En")
          .Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Units",
      id: "propertyUnits",
      accessor: (d) => d?.propertyUnits?.length,
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
