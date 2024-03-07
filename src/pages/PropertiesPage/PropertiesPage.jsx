import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import AdminTable from "../../components/Admin/table/AdminTable";
import { ComposeColumns } from "./PropertiesListColumns";
import { ComposeColumns as BuyCompose } from "./PropertiesBuyListColumns";
import { ComposeColumns as RentCompose } from "./PropertiesRentListColumns";
import {
  toggleAllColumns,
  toggleColumn,
  exportToCSV,
} from "../../utils/table-helper";
import PageSimple from "../../components/Admin/layout/PageSimple";

import { CircularProgress } from "@mui/material";
import DeleteDialog from "../../components/Admin/DeleteDialog";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import { hideMessage, showMessage } from "../../redux/messageAction.slice";
import {
  useDeletePropertyMutation,
  useGetPropertiesQuery,
} from "../../redux/properties/propertiesSlice";
// import PropertyDrawer from "./PropertiesDrawer";
import PropertyRentDrawer from "./PropertiesRentDrawer";
import { Add } from "@mui/icons-material";
import Slider from "react-slick";
import PropertyBuyDrawer from "./PropertiesBuyDrawer";
import { useGetProfileQuery } from "../../redux/auth/authApiSlice";
import PropertyPDF from "./PropertyPDF";
const PropertyPage = () => {
  const {
    data: properties,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetPropertiesQuery();
  const [
    deleteProperty,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeletePropertyMutation();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [DrawerPDFID, setDrawerPDFID] = useState("");
  const [DrawerPDFOpen, setDrawerPDFOpen] = useState(false);
  const [drawerRentOpen, setDrawerRentOpen] = useState(false);
  const [drawerRentID, setDrawerRentID] = useState("");
  const [drawerBuyOpen, setDrawerBuyOpen] = useState(false);
  const [drawerBuyID, setDrawerBuyID] = useState("");
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: profile, isSuccess: profileIsSuccess } = useGetProfileQuery();

  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.email);
    dispatch(openDeleteDialog(model));
  };
  const onDownload = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDrawerPDFID(model.id);
    setDrawerPDFOpen(true);
  };
  useEffect(() => {
    if (isError) {
      dispatch(
        showMessage({
          message: error,
          variant: "error",
        })
      );
    }
    if (deleteIsSuccess) {
      dispatch(
        showMessage({
          message: "Deleted!",
          variant: "success",
        })
      );
    }
    if (deleteIsError) {
      dispatch(
        showMessage({
          message: deleteError,
          variant: "error",
        })
      );
    }
  }, [isError, deleteIsError, deleteIsSuccess]);
  const [columns, setColumns] = useState(ComposeColumns(onDelete, onDownload));
  const [buyColumns, setBuyColumns] = useState(
    BuyCompose(onDelete, onDownload)
  );
  const [rentColumns, setRentColumns] = useState(
    RentCompose(onDelete, onDownload)
  );
  function yesDeleteContact(flg, data) {
    if (flg === true) {
      //delete
      deleteProperty({ id: data.id })
        .then((payload) => {
          dispatch(closeDeleteDialog());
        })
        .catch(() => {
          dispatch(closeDeleteDialog());
        });
    } else {
      //do nothing
      dispatch(closeDeleteDialog());
    }
  }
  const handleToggleColumn = (columnId) => {
    //it's a toggle all

    if (!columnId) setColumns(toggleAllColumns(columns));
    else setColumns(toggleColumn(columns, columnId));
  };
  const handleRentToggleColumn = (columnId) => {
    //it's a toggle all

    if (!columnId) setRentColumns(toggleAllColumns(rentColumns));
    else setRentColumns(toggleColumn(rentColumns, columnId));
  };
  const handleBuyToggleColumn = (columnId) => {
    //it's a toggle all

    if (!columnId) setBuyColumns(toggleAllColumns(buyColumns));
    else setBuyColumns(toggleColumn(buyColumns, columnId));
  };
  useEffect(() => {
    dispatch(hideMessage());
  }, []);
  const [propertiesData, setPropertiesData] = useState();
  useEffect(() => {
    if (currentSlide == 0) {
      if (isSuccess) setPropertiesData(properties.allProperties);
    }
    if (currentSlide == 1) {
      if (isSuccess) setPropertiesData(properties.rentProperties);
    }
    if (currentSlide == 2) {
      if (isSuccess) setPropertiesData(properties.buyProperties);
    } else {
      if (isSuccess) setPropertiesData(properties.allProperties);
    }
  }, [currentSlide, isSuccess]);
  const handleOnCSVExport = () => {
    exportToCSV("Properties", columns, propertiesData);
  };
  const handleRentOnCSVExport = () => {
    exportToCSV("Properties", rentColumns, propertiesData);
  };
  const handleBuyOnCSVExport = () => {
    exportToCSV("Properties", buyColumns, propertiesData);
  };
  const puposeButtons = ["All", "Rent", "Buy"];

  const [disabledButtons, setDisabledButtons] = useState(false);
  useEffect(() => {
    setDisabledButtons(true);
    setTimeout(() => {
      setDisabledButtons(false);
    }, 800);
  }, [currentSlide]);

  return (
    <>
      <PropertyRentDrawer
        drawerOpen={drawerRentOpen}
        setDrawerOpen={setDrawerRentOpen}
        drawerID={drawerRentID}
        setDrawerID={setDrawerRentID}
      />
      <PropertyBuyDrawer
        drawerOpen={drawerBuyOpen}
        setDrawerOpen={setDrawerBuyOpen}
        drawerID={drawerBuyID}
        setDrawerID={setDrawerBuyID}
      />
      <PropertyPDF
        drawerOpen={DrawerPDFID}
        setDrawerOpen={setDrawerPDFOpen}
        drawerID={DrawerPDFID}
        setDrawerID={setDrawerPDFID}
      />
      <PageSimple
        content={
          <div className="relative">
            <div className="flex justify-center items-center gap-x-3 p-4 rounded-md">
              {puposeButtons.map((item, index) => {
                return (
                  <button
                    key={index}
                    disabled={disabledButtons}
                    className={`w-full h-full py-1 px-2 text-center font-semibold text-med rounded-md border-2 border-secondary ${
                      currentSlide == index ? " bg-primary text-white" : ""
                    } cursor-pointer transition-all duration-300 text-black`}
                    onClick={() => {
                      sliderRef.current.slickGoTo(index);
                      setCurrentSlide(index);
                      setSearchText("");
                      setDrawerRentID("");
                      setDrawerBuyID("");
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <Slider
              accessibility={false}
              ref={sliderRef}
              dots={false}
              touchMove={false}
              swipe={false}
              arrows={false}
              initialSlide={currentSlide}
              infinite={false}
              className="overflow-hidden h-full w-full col-span-full"
            >
              <PageCard
                key={0}
                searchText={searchText}
                handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
                table={
                  isLoading || isFetching ? (
                    <div className="flex flex-row justify-center items-center p-44">
                      <CircularProgress color="primary" />
                    </div>
                  ) : (
                    <AdminTable
                      noDataMessage="There are no Properties"
                      searchText={searchText}
                      columns={columns}
                      loading={isLoading}
                      data={properties?.allProperties?.entities}
                      dataCount={properties?.allProperties?.count}
                      onRowClick={(ev, row) => {
                        if (row.original.Purpose == "Rent") {
                          setDrawerRentID(row.original?.id);
                          setDrawerRentOpen(true);
                        } else {
                          setDrawerBuyID(row.original?.id);
                          setDrawerBuyOpen(true);
                        }
                      }}
                      isShown
                    />
                  )
                }
                handleCheckChange={(columnId) => handleToggleColumn(columnId)}
                columnsOfTogglerColumns={columns
                  .filter(
                    (column) =>
                      !(column.id === "action" || column.id === "monitor") &&
                      !column.lockToggle
                  )
                  .map((column) => ({
                    name: column.Header,
                    id: column.id,
                    checked: column.checked,
                  }))}
                columnsToggler
                exportMenu={{
                  onCSVExport: handleOnCSVExport,
                }}
              />
              <PageCard
                key={1}
                searchText={searchText}
                handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
                PrimaryButtonlabel={
                  profile.Role.Role_Resources.find(
                    (x) => x.resource.Name == "Property"
                  ).Create == true && <Add fontSize="large" />
                }
                onClickPrimaryBtn={(ev) => {
                  setDrawerRentID("");
                  setDrawerRentOpen(true);
                }}
                table={
                  isLoading || isFetching ? (
                    <div className="flex flex-row justify-center items-center p-44">
                      <CircularProgress color="primary" />
                    </div>
                  ) : (
                    <AdminTable
                      noDataMessage="There are no Rent Properties"
                      searchText={searchText}
                      columns={rentColumns}
                      loading={isLoading}
                      data={properties.rentProperties?.entities}
                      dataCount={properties.rentProperties?.count}
                      onRowClick={(ev, row) => {
                        setDrawerRentID(row.original?.id);
                        setDrawerRentOpen(true);
                      }}
                      isShown
                    />
                  )
                }
                handleCheckChange={(columnId) =>
                  handleRentToggleColumn(columnId)
                }
                columnsOfTogglerColumns={rentColumns
                  .filter(
                    (column) =>
                      !(column.id === "action" || column.id === "monitor") &&
                      !column.lockToggle
                  )
                  .map((column) => ({
                    name: column.Header,
                    id: column.id,
                    checked: column.checked,
                  }))}
                columnsToggler
                exportMenu={{
                  onCSVExport: handleRentOnCSVExport,
                }}
              />
              <PageCard
                key={2}
                searchText={searchText}
                handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
                PrimaryButtonlabel={
                  profile.Role.Role_Resources.find(
                    (x) => x.resource.Name == "Property"
                  ).Create == true && <Add fontSize="large" />
                }
                onClickPrimaryBtn={(ev) => {
                  setDrawerBuyID("");
                  setDrawerBuyOpen(true);
                }}
                table={
                  isLoading || isFetching ? (
                    <div className="flex flex-row justify-center items-center p-44">
                      <CircularProgress color="primary" />
                    </div>
                  ) : (
                    <AdminTable
                      key={2}
                      noDataMessage="There are no Buy Properties"
                      searchText={searchText}
                      columns={buyColumns}
                      loading={isLoading}
                      data={properties.buyProperties?.entities}
                      dataCount={properties.buyProperties?.count}
                      onRowClick={(ev, row) => {
                        setDrawerBuyID(row.original?.id);
                        setDrawerBuyOpen(true);
                      }}
                      isShown
                    />
                  )
                }
                handleCheckChange={(columnId) =>
                  handleBuyToggleColumn(columnId)
                }
                columnsOfTogglerColumns={buyColumns
                  .filter(
                    (column) =>
                      !(column.id === "action" || column.id === "monitor") &&
                      !column.lockToggle
                  )
                  .map((column) => ({
                    name: column.Header,
                    id: column.id,
                    checked: column.checked,
                  }))}
                columnsToggler
                exportMenu={{
                  onCSVExport: handleBuyOnCSVExport,
                }}
              />
            </Slider>
          </div>
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <DeleteDialog
        deletedName={deletedName}
        loading={deleteLoading}
        yesDeleteClick={(bool, data) => {
          yesDeleteContact(bool, data);
        }}
      />
    </>
  );
};

export default PropertyPage;
