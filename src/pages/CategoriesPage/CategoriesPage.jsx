import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import PageSimple from "../../components/Admin/layout/PageSimple";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { CircularProgress, IconButton } from "@mui/material";
import { EditOutlined, DeleteRounded } from "@mui/icons-material";
import DeleteDialog from "../../components/Admin/DeleteDialog";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import { hideMessage, showMessage } from "../../redux/messageAction.slice";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../redux/categories/categoriesSlice";
import CategoryDrawer from "./CategoriesDrawer";

const CategoriesPage = () => {
  const {
    data: cats,
    isLoading: catsLoading,
    isFetching: catsFetching,
    isSuccess: catsSuccess,
    isError: catsIsError,
    error: catsError,
  } = useGetCategoriesQuery();

  const [
    deleteCategory,
    {
      isSuccess: catDeleteIsSuccess,
      isError: catDeleteIsError,
      error: catDeleteError,
      isLoading: catDeleteLoading,
    },
  ] = useDeleteCategoryMutation();

  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [DrawerOpen, setDrawerOpen] = useState(false);
  const [DrawerId, setDrawerId] = useState("");
  const [parentId, setParentId] = useState("");
  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.nameEn);
    dispatch(openDeleteDialog(model));
  };

  useEffect(() => {
    if (catsIsError) {
      dispatch(
        showMessage({
          message: catsError,
          variant: "error",
        })
      );
    }

    if (catDeleteIsSuccess) {
      dispatch(
        showMessage({
          message: "Deleted!",
          variant: "success",
        })
      );
    }

    if (catDeleteIsError) {
      dispatch(
        showMessage({
          message: catDeleteError,
          variant: "error",
        })
      );
    }
  }, [catsIsError, catDeleteIsError, catDeleteIsSuccess]);
  function yesDeleteContact(flg, data) {
    if (flg === true) {
      //delete
      deleteCategory({ id: data.id })
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
  useEffect(() => {
    dispatch(hideMessage());
  }, [catsSuccess]);
  const handleChildren = (item) =>
    cats?.ids?.map((item1) => {
      if (item === cats?.entities[item1]?.parentId) {
        return (
          <TreeItem
            nodeId={item1 + item1 + 4}
            key={item1}
            // expandIcon={true}
            // collapseIcon={true}
            label={
              <div className="flex justify-center items-center">
                <div className="grid grid-cols-7 flex-1">
                  <p className="text-xl ">{cats?.entities[item1]?.nameEn}</p>
                  <p className="text-xl ">{cats?.entities[item1]?.nameAr}</p>
                  {cats?.entities[item1]?.isActive === true ? (
                    <div className="text-[green] mx-2">{"Active"}</div>
                  ) : (
                    <div className="text-[red] mx-2">{"Inactive"}</div>
                  )}
                </div>
                <div
                  className="self-center  font-bold text-xl rounded px-2 py-1  bg-secondary hover:bg-primary hover:text-secondary text-[#E8E8E8] mx-2 pb-2"
                  style={{ transition: "0.3s" }}
                  onClick={() => {
                    setDrawerId("");
                    setDrawerOpen(true);
                    setParentId(item1);
                  }}
                >
                  New Child
                </div>
                <div
                  className="self-center  font-bold text-xl rounded px-2 py-1 bg-secondary hover:bg-primary hover:text-secondary  text-[#E8E8E8] mx-2 pb-2"
                  style={{ transition: "0.3s" }}
                  onClick={() => {
                    setDrawerId(item1);
                    setDrawerOpen(true);
                    setParentId(item);
                  }}
                >
                  <EditOutlined />
                </div>

                <div
                  className="self-center  font-bold text-xl rounded px-2 py-1  hover:bg-secondary text-red-700 mx-2 pb-2"
                  style={{ transition: "0.3s" }}
                  onClick={(ev) => {
                    onDelete(ev, cats?.entities[item1]);
                  }}
                >
                  <DeleteRounded />
                </div>
              </div>
            }
            style={{ flex: 1, margin: "1rem" }}
          >
            {handleChildren(item1)}
          </TreeItem>
        );
      }
    });
  return (
    <>
      <CategoryDrawer
        drawerID={DrawerId}
        drawerOpen={DrawerOpen}
        setDrawerID={setDrawerId}
        setDrawerOpen={setDrawerOpen}
        parentId={parentId}
      />

      <PageSimple
        classes={{
          contentWrapper: "p-0 sm:pr-24 pl-24 pb-80 pt-0 sm:pb-80 pt-0 h-full",
          content: "flex flex-col h-full",
          leftSidebar: "w-256 border-0",
          wrapper: "min-h-0",
        }}
        content={
          <>
            <PageCard
              searchText={searchText}
              handleChangeTextBox={(ev) => setSearchText(ev.target.value)}
              PrimaryButtonlabel="New Category"
              onClickPrimaryBtn={(ev) => {
                setParentId("");
                setDrawerId("");
                setDrawerOpen(true);
              }}
              table={
                catsLoading || catsFetching ? (
                  <div className="flex flex-row justify-center items-center p-44">
                    <CircularProgress color="inherit" />
                  </div>
                ) : catsSuccess && cats?.ids?.length === 0 ? (
                  <div className="col-span-12 flex flex-row justify-center items-center p-24 ">
                    <p className="font-[FBold] text-5xl"> No Categries Yet</p>
                  </div>
                ) : (
                  <>
                    <TreeView
                      aria-label="file system navigator"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                      }}
                    >
                      {cats?.ids?.map((item) => {
                        if (cats?.entities[item].parentId == null)
                          if (
                            cats?.entities[item].nameEn
                              .toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            cats?.entities[item].nameAr
                              .toLowerCase()
                              .includes(
                                searchText.toLowerCase() || searchText === ""
                              )
                          )
                            return (
                              <TreeItem
                                nodeId={item}
                                key={item}
                                label={
                                  <div className="flex justify-center items-center">
                                    <div className="grid grid-cols-7 flex-1 gap-0">
                                      <p className="text-xl">
                                        {cats?.entities[item].nameEn}
                                      </p>
                                      <p className="text-xl">
                                        {cats?.entities[item].nameAr}
                                      </p>

                                      {cats?.entities[item].isActive ===
                                      true ? (
                                        <div className="text-[green] mx-2">
                                          {"Active"}
                                        </div>
                                      ) : (
                                        <div className="text-[red] mx-2">
                                          {"Inactive"}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-center">
                                      <div
                                        className="self-center  font-bold text-xl rounded px-2 py-1 bg-secondary hover:bg-primary text-[#E8E8E8] hover:text-secondary  mx-2 pb-2"
                                        style={{ transition: "0.3s" }}
                                        onClick={() => {
                                          setDrawerId("");
                                          setDrawerOpen(true);
                                          setParentId(item);
                                        }}
                                      >
                                        New Child
                                      </div>
                                      <div
                                        className="self-center  font-bold text-xl rounded px-2 py-1  bg-secondary hover:bg-primary hover:text-secondary text-[#E8E8E8] mx-2 pb-2"
                                        style={{ transition: "0.3s" }}
                                        onClick={() => {
                                          setDrawerId(item);
                                          setDrawerOpen(true);
                                        }}
                                      >
                                        <EditOutlined />
                                      </div>
                                    </div>

                                    <div
                                      className="self-center  font-bold text-xl rounded px-2 py-1 hover:bg-secondary text-red-700 mx-2 pb-2"
                                      style={{ transition: "0.3s" }}
                                      onClick={(ev) => {
                                        onDelete(ev, cats?.entities[item]);
                                      }}
                                    >
                                      <DeleteRounded />
                                    </div>
                                  </div>
                                }
                                style={{ flex: 1, margin: "1rem" }}
                              >
                                {handleChildren(item)}
                              </TreeItem>
                            );
                      })}
                    </TreeView>
                  </>
                )
              }
            />
          </>
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
      <DeleteDialog
        deletedName={deletedName}
        loading={catDeleteLoading}
        yesDeleteClick={(bool, data) => {
          yesDeleteContact(bool, data);
        }}
      />
    </>
  );
};

export default CategoriesPage;
