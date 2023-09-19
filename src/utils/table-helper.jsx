// import FuseUtils from "@fuse/utils";
import Utils from "../components/Admin/table/Utils";
import _ from "lodash";
import moment from "moment";
import Papa from "papaparse";
export const toggleColumn = (columns, columnId) => {
  return columns.map((column) => {
    if (column.id === columnId) return { ...column, checked: !column.checked };
    return column;
  });
};

export const toggleAllColumns = (columns) => {
  let firstColumnCase = columns[0] ? columns[0].checked : false;

  return columns.map((column) => ({ ...column, checked: !firstColumnCase }));
};

export const getFilteredArray = (entities, _searchText) => {
  const arr = Object.keys(entities).map((id) => entities[id]);
  if (_searchText.length === 0) {
    return arr;
  }
  return Utils.filterArrayByString(arr, _searchText);
};
export const exportToCSV = (fileName, columns, data) => {
  const headerNames = columns.filter((d) => d.checked).map((col) => col.Header);

  //gets the values of the headers shown
  const columnKeys = columns.filter((c) => c.checked).map((c) => c.id);

  const csvString = Papa.unparse(
    {
      fields: headerNames,
      data: data.ids.map((d) =>
        Object.values(_.pick(data.entities[d], columnKeys))
      ),
    },
    {
      // escapes field values that begin with =, +, -, or @, will be prepended with a ' to
      // defend against injection attacks, because Excel and LibreOffice will automatically parse such cells
      // as formulae.
      escapeFormulae: true,
    }
  );

  let fileNameWithTimestamp =
    fileName + "-" + moment(new Date()).format("DD-MMM-YYYY");

  // var table = `
  //           <!DOCTYPE html>
  //              <html lang="zh-Hans">
  //                   <head>
  //                       <meta charset="UTF-8">
  //                       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //                       <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //                       <title>Regreen Report</title>

  //                       <style>
  //                           table {
  //                               border-collapse:collapse;
  //                               border: 1px solid black;
  //                               background-color: black;
  //                               color: #0f0;
  //                           }
  //                           tr{
  //                               border: 1px solid black;
  //                               color: black;
  //                           }
  //                           td {
  //                               border: 1px solid black;
  //                           }
  //                       </style>
  //                   </head>
  //               <body>
  //                   <table class="table-test">
  //                       <tr>
  //           `;
  // for (var i = 0; i < data.length; i++) {
  //   if (i === 0) {
  //     //create the heading row for the table before adding any data rows
  //     for (var prop in data[i]) {
  //       table = table + "<td>" + prop + "</td>";
  //     }
  //     table = table + "</tr>";
  //   }
  //   //append data row now
  //   table = table + "<tr>";
  //   for (var prop in data[i]) {
  //     table =
  //       table +
  //       "<td>" +
  //       (data[i][prop] === null ? "" : data[i][prop]) +
  //       "</td>";
  //   }
  //   table = table + "</tr>";
  // }
  // // end
  // table =
  //   table +
  //   `
  //               </table>
  //                   </body>
  //                       </html>
  //           `;
  // table = table.replace(/<a[^>]*>|<\/a>/gi, ""); //remove if u want links in your table
  // table = table.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  // table = table.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

  // // document.getElementById("exportedTable").innerHTML = table;
  // // document.getElementById("exportedHtml").innerHTML = table;
  var myBlob = new Blob([csvString], { type: "text/html" });

  var url = window.URL.createObjectURL(myBlob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = `${fileNameWithTimestamp}.csv`;
  a.click();
  // ???
  window.URL.revokeObjectURL(url);
};
