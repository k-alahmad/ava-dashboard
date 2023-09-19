import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { selectDeleteDialog } from "../../redux/deleteAction.slice";

import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteDialog(props) {
  const deleteDialog = useSelector(selectDeleteDialog);
  const yesDeleteClick = props.yesDeleteClick || undefined;
  const yesDelete = () => {
    yesDeleteClick(true, deleteDialog.data);
  };
  const handleClose = () => {
    yesDeleteClick(false);
  };

  return (
    <div>
      <Dialog
        {...deleteDialog.props}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth="xs"
        onClose={handleClose}
        open={deleteDialog.props.open}
        data={props.data}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Delete Message"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete {props.deletedName} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="flex flex-1 items-center justify-between sm:p-12">
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={yesDelete}
              disabled={props.loading}
            >
              {!props.loading ? (
                props.ok ? (
                  props.ok
                ) : (
                  "Delete"
                )
              ) : (
                <CircularProgress color="inherit" size={15} />
              )}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default DeleteDialog;
