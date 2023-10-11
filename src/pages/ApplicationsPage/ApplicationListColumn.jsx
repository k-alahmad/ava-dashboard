import React from "react";
import { IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export const ComposeColumns = (onDelete) => {
  return [
    {
      Header: "Guest Name",
      id: "GuestName",
      accessor: (d) => d.Applicant?.FullName,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Guest Email",
      id: "GuestEmail ",
      accessor: (d) => d.Applicant?.Email,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Years Of Experience",
      id: "YearsOfExp",
      accessor: (d) => d.YearsOfExp,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
      lockToggle: true,
    },
    {
      Header: "Area Specialty",
      id: "AreaSpecialty",
      accessor: (d) => d.AreaSpecialty,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
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
      Header: "LinkedIn Link",
      id: "LinkedInURL",
      accessor: (d) => d.LinkedInURL,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Field",
      id: "Field",
      accessor: (d) => d.Field,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "English Level",
      id: "EnglishLvl",
      accessor: (d) => d.EnglishLvl,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Arabic Level",
      id: "ArabicLvl",
      accessor: (d) => d.ArabicLvl,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Other Languages",
      id: "OtherLanguages",
      accessor: (d) => d.OtherLanguages,
      className: "font-bold",
      sortable: true,
      show: false,
      checked: true,
    },
    {
      Header: "Job Title",
      id: "JobTitle",
      accessor: (d) =>
        d.Job?.Jobs_Translation?.find((x) => x.Language.Code == "En").Title,
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
