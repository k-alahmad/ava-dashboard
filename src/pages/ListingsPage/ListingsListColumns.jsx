import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
export const ComposeColumns = (onDelete) => {
  return [
    // {
    //   Header: "Name",
    //   id: "Name",
    //   accessor: (d) =>
    //     d.Property_Translation.find((x) => x.Language.Code == "En").Name,
    //   className: "font-bold",
    //   sortable: true,
    //   show: false,
    //   checked: true,
    //   lockToggle: false,
    // },
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
      accessor: (d) =>
        d.Bacloney === true ? <p> {"Yes"} </p> : <p> {"No"} </p>,
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
      Header: "Furnishing Status",
      id: "FurnishingStatus",
      accessor: (d) => d.FurnishingStatus,
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
