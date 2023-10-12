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
            src={API_BASE_URL + d?.Image?.URL}
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
      Header: "Title",
      id: "Title",
      accessor: (d) =>
        d.Announcements_Translation.find((x) => x.Language.Code == "En").Title,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Rank",
      id: "Rank",
      accessor: (d) => d.Rank,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Type",
      id: "Type",
      accessor: (d) => d.Type,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },
    {
      Header: "Link",
      id: "Link",
      accessor: (d) => d.Link,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: false,
    },

    {
      Header: "Start Date",
      id: "StartDate",
      accessor: (d) => d.StartDate.split("T")[0],
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "End Date",
      id: "EndDate",
      accessor: (d) => d.EndDate.split("T")[0],
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
