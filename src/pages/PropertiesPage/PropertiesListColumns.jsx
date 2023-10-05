import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { API_BASE_URL } from "../../constants";
export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Image",
      id: "image",
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
      accessor: (d) =>
        d.Property_Translation.find((x) => x.Language.Code == "En").Name,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Price",
      id: "Price",
      accessor: (d) => d.Price,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Bedrooms",
      id: "Bedrooms",
      accessor: (d) => d.Bedrooms,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Bacloney",
      id: "Bacloney",
      accessor: (d) => d.Bacloney,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Balcony Size",
      id: "BalconySize",
      accessor: (d) => d.BalconySize,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Rent Min",
      id: "RentMin",
      accessor: (d) => d.RentMin,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Rent Max",
      id: "RentMax",
      accessor: (d) => d.RentMax,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
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
      Header: "Longitude",
      id: "Longitude",
      accessor: (d) => d.Longitude,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Latitude",
      id: "Latitude",
      accessor: (d) => d.Latitude,
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
