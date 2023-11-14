import React, { useState, useEffect, useRef } from "react";
import PageCard from "../../components/Admin/PageCard";
import { useDispatch } from "react-redux";
import PageSimple from "../../components/Admin/layout/PageSimple";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { CircularProgress } from "@mui/material";
import { EditOutlined, DeleteRounded } from "@mui/icons-material";
import DeleteDialog from "../../components/Admin/DeleteDialog";
import {
  closeDeleteDialog,
  openDeleteDialog,
} from "../../redux/deleteAction.slice";
import { hideMessage, showMessage } from "../../redux/messageAction.slice";
import {
  useGetCategoryQuery,
  useDeleteCategoryMutation,
} from "../../redux/categories/categoriesSlice";
import CategoryDrawer from "./CategoriesDrawer";
import { Add } from "@mui/icons-material";
const CategoryPage = () => {
  const {
    data: categoryes,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetCategoryQuery();

  const [
    deleteCategory,
    {
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      error: deleteError,
      isLoading: deleteLoading,
    },
  ] = useDeleteCategoryMutation();

  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [deletedName, setDeletedName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [DrawerOpen, setDrawerOpen] = useState(false);
  const [DrawerId, setDrawerId] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentName, setParentName] = useState("");
  const onDelete = (event, model) => {
    event.preventDefault();
    event.stopPropagation();
    setDeletedName(model.nameEn);
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
  }, [isSuccess]);

  const handleChildren = (item) =>
    categoryes?.ids?.map((item1) => {
      if (item === categoryes?.entities[item1]?.ParentID) {
        return (
          <TreeItem
            nodeId={item1 + item1 + 4}
            key={item1}
            label={
              <div className="flex items-center">
                <div className="flex max-md:flex-col max-md:gap-y-2 justify-between items-start flex-1 gap-0">
                  <p className="text-xl font-bold flex-1">
                    {
                      categoryes?.entities[item1]?.Category_Translation.find(
                        (x) => x.Language.Code == "En"
                      ).Name
                    }
                  </p>
                  <p className="text-xl flex-1">
                    {"Sub-Categories: "}
                    {categoryes?.entities[item1]?._count.SubCategory}
                  </p>
                  <p className="text-xl flex-1">
                    {" Properties: "}
                    {categoryes?.entities[item1]?._count.Property}
                  </p>
                  {categoryes?.entities[item1]?.ActiveStatus === true ? (
                    <div className="text-[green] mx-2 flex-1">{"Active"}</div>
                  ) : (
                    <div className="text-[red] mx-2 flex-1">{"Inactive"}</div>
                  )}
                </div>
                <div className="flex max-sm:flex-col max-sm:gap-y-2 items-center justify-center">
                  <div
                    className="self-center font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80 text-secondary mx-2 pb-2"
                    style={{ transition: "0.3s" }}
                    onClick={() => {
                      setDrawerId("");
                      setDrawerOpen(true);
                      setParentId(item1);
                      setParentName(
                        categoryes.entities[item1]?.Category_Translation.find(
                          (x) => x.Language.Code == "En"
                        ).Name
                      );
                    }}
                  >
                    <Add fontSize="medium" />
                  </div>
                  <div
                    className="self-center  font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80  text-secondary mx-2 pb-2"
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
                    className="self-center  font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80 text-secondary mx-2 pb-2"
                    style={{ transition: "0.3s" }}
                    onClick={(ev) => {
                      onDelete(ev, categoryes?.entities[item1]);
                    }}
                  >
                    <DeleteRounded />
                  </div>
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
        parentName={parentName}
        setParentName={setParentName}
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
              PrimaryButtonlabel={<Add fontSize="large" />}
              onClickPrimaryBtn={(ev) => {
                setParentId("");
                setDrawerId("");
                setParentName("");
                setDrawerOpen(true);
              }}
              table={
                isLoading || isFetching ? (
                  <div className="flex flex-row justify-center items-center p-44">
                    <CircularProgress color="inherit" />
                  </div>
                ) : isSuccess && categoryes?.ids?.length === 0 ? (
                  <div className="col-span-12 flex flex-row justify-center items-center p-24 ">
                    <p className="font-[FBold] text-5xl"> No Categories Yet</p>
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
                      {categoryes?.ids?.map((item, index) => {
                        if (categoryes?.entities[item].ParentID == null)
                          if (
                            categoryes?.entities[
                              item
                            ]?.Category_Translation.find(
                              (x) => x.Language.Code == "En"
                            )
                              ?.Name.toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            categoryes?.entities[
                              item
                            ]?.Category_Translation.find(
                              (x) => x.Language.Code == "Ar"
                            )
                              ?.Name.toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            categoryes?.entities[
                              item
                            ]?.Category_Translation.find(
                              (x) => x.Language.Code == "Fa"
                            )
                              ?.Name.toLowerCase()
                              .includes(searchText.toLowerCase()) ||
                            categoryes?.entities[
                              item
                            ]?.Category_Translation.find(
                              (x) => x.Language.Code == "Ru"
                            )
                              ?.Name.toLowerCase()
                              .includes(searchText.toLowerCase())
                          )
                            return (
                              <TreeItem
                                nodeId={item}
                                key={index}
                                label={
                                  <div className="flex items-center">
                                    <div className="flex max-md:flex-col max-md:gap-y-2 justify-between items-start flex-1 gap-0">
                                      <p className="text-xl font-bold flex-1">
                                        {
                                          categoryes?.entities[
                                            item
                                          ]?.Category_Translation.find(
                                            (x) => x.Language.Code == "En"
                                          ).Name
                                        }
                                      </p>
                                      <p className="text-xl flex-1">
                                        {" Sub-Categories: "}
                                        {
                                          categoryes?.entities[item]._count
                                            .SubCategory
                                        }
                                      </p>
                                      <p className="text-xl flex-1">
                                        {" Properties: "}
                                        {
                                          categoryes?.entities[item]._count
                                            .Property
                                        }
                                      </p>
                                      {categoryes?.entities[item]
                                        .ActiveStatus === true ? (
                                        <div className="text-[green] mx-2 flex-1">
                                          {"Active"}
                                        </div>
                                      ) : (
                                        <div className="text-[red] mx-2 flex-1">
                                          {"Inactive"}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex max-sm:flex-col max-sm:gap-y-2 items-center justify-center">
                                      <div
                                        className="self-center  font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80 text-secondary mx-2 pb-2"
                                        style={{ transition: "0.3s" }}
                                        onClick={() => {
                                          setDrawerId("");
                                          setDrawerOpen(true);
                                          setParentId(item);
                                          setParentName(
                                            categoryes.entities[
                                              item
                                            ]?.Category_Translation.find(
                                              (x) => x.Language.Code == "En"
                                            ).Name
                                          );
                                        }}
                                      >
                                        <Add fontSize="medium" />
                                      </div>
                                      <div
                                        className="self-center  font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80 text-secondary mx-2 pb-2"
                                        style={{ transition: "0.3s" }}
                                        onClick={() => {
                                          setDrawerId(item);
                                          setDrawerOpen(true);
                                        }}
                                      >
                                        <EditOutlined />
                                      </div>
                                      <div
                                        className="self-center  font-bold text-xl rounded px-2 py-1 bg-primary hover:bg-primary/80 text-secondary mx-2 pb-2"
                                        style={{ transition: "0.3s" }}
                                        onClick={(ev) => {
                                          onDelete(
                                            ev,
                                            categoryes?.entities[item]
                                          );
                                        }}
                                      >
                                        <DeleteRounded />
                                      </div>
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
        loading={deleteLoading}
        yesDeleteClick={(bool, data) => {
          yesDeleteContact(bool, data);
        }}
      />
    </>
  );
};

export default CategoryPage;
