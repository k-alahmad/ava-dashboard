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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerID, setDrawerID] = useState("");
  const [drawerRentOpen, setDrawerRentOpen] = useState(false);
  const [drawerRentID, setDrawerRentID] = useState("");
  const [drawerBuyOpen, setDrawerBuyOpen] = useState(false);
  const [drawerBuyID, setDrawerBuyID] = useState("");
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.email);
    dispatch(openDeleteDialog(model));
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
  const [columns, setColumns] = useState(ComposeColumns(onDelete));
  const [buyColumns, setBuyColumns] = useState(BuyCompose(onDelete));
  const [rentColumns, setRentColumns] = useState(RentCompose(onDelete));
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
    if (currentSlide == 0) {
      if (!columnId) setColumns(toggleAllColumns(columns));
      else setColumns(toggleColumn(columns, columnId));
    }
    if (currentSlide == 1) {
      if (!columnId) setRentColumns(toggleAllColumns(rentColumns));
      else setRentColumns(toggleColumn(columns, columnId));
    }
    if (currentSlide == 2) {
      if (!columnId) setBuyColumns(toggleAllColumns(buyColumns));
      else setBuyColumns(toggleColumn(columns, columnId));
    }
  };
  useEffect(() => {
    dispatch(hideMessage());
  }, []);
  const [columnsArray, setColumnsArray] = useState(columns);
  const [propertiesData, setPropertiesData] = useState();
  useEffect(() => {
    if (currentSlide == 0) {
      setColumnsArray(columns);
      if (isSuccess) setPropertiesData(properties.allProperties);
    }
    if (currentSlide == 1) {
      setColumnsArray(rentColumns);
      if (isSuccess) setPropertiesData(properties.rentProperties);
    }
    if (currentSlide == 2) {
      setColumnsArray(buyColumns);
      if (isSuccess) setPropertiesData(properties.buyProperties);
    } else {
      setColumnsArray(columns);
      if (isSuccess) setPropertiesData(properties.allProperties);
    }
  }, [currentSlide, isSuccess]);
  const handleOnCSVExport = () => {
    exportToCSV("Properties", columnsArray, propertiesData);
  };
  const puposeButtons = ["All", "Rent", "Buy"];
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
      <PageSimple
        content={
          <>
            <PageCard
              searchText={searchText}
              handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
              PrimaryButtonlabel={
                currentSlide !== 0 && <Add fontSize="large" />
              }
              onClickPrimaryBtn={(ev) => {
                if (currentSlide == 1) {
                  setDrawerRentID("");
                  setDrawerRentOpen(true);
                } else if (currentSlide == 2) {
                  setDrawerBuyID("");
                  setDrawerBuyOpen(true);
                }
              }}
              other={
                <div className="flex justify-start items-center gap-x-8 px-12 w-full">
                  {puposeButtons.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`w-full max-w-[250px] py-1 px-2 text-center font-semibold shadow-md ${
                          currentSlide == index
                            ? "bg-primary text-secondary"
                            : "bg-secondary text-white"
                        } cursor-pointer transition-all duration-300 text-black rounded-md`}
                        onClick={() => {
                          sliderRef.current.slickGoTo(index);
                          setCurrentSlide(index);
                          setSearchText("");
                          setDrawerID("");
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              }
              table={
                isLoading || isFetching ? (
                  <div className="flex flex-row justify-center items-center p-44">
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  <Slider
                    ref={sliderRef}
                    dots={false}
                    touchMove={false}
                    swipe={false}
                    arrows={false}
                    initialSlide={currentSlide}
                    infinite={false}
                    className="overflow-hidden h-full w-full col-span-full"
                  >
                    <AdminTable
                      key={0}
                      noDataMessage="There are no Properties"
                      searchText={searchText}
                      columns={columns}
                      loading={isLoading}
                      data={properties?.allProperties?.entities}
                      dataCount={properties?.allProperties?.count}
                      onRowClick={(ev, row) => {
                        // setDrawerID(row.original?.id);
                        // setDrawerOpen(true);
                      }}
                      isShown
                    />
                    <AdminTable
                      key={1}
                      noDataMessage="There are no Properties"
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
                    <AdminTable
                      key={2}
                      noDataMessage="There are no Properties"
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
                  </Slider>
                )
              }
              handleCheckChange={(columnId) => handleToggleColumn(columnId)}
              columnsOfTogglerColumns={columnsArray
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
          </>
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
