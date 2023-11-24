import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";

export const ComposeColumns = (onDelete) => {
  const { data, isSuccess } = useGetProfileQuery();

  return [
    {
      Header: "Title",
      id: "Title",
      accessor: (d) => d.Title,
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Description",
      id: "Description",
      accessor: (d) => d.Description,
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Users Count",
      id: "Users",
      accessor: (d) => d.Users?.length,
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
      Cell: ({ row }) => {
        if (isSuccess)
          if (
            data?.Role?.Role_Resources?.find((x) => x?.resource?.Name == "Team")
              ?.Delete == true
          )
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
