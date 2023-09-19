import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectCustomDialog } from "../../redux/customDialogAction";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CustomDialog(props) {
  const customDialog = useSelector(selectCustomDialog);
  const confirmClick = props.confirmClick || undefined;
  const confirm = () => {
    confirmClick(true, customDialog.data);
  };
  const handleClose = () => {
    confirmClick(false);
  };

  return (
    <div>
      <Dialog
        {...customDialog.props}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth="xs"
        onClose={handleClose}
        open={customDialog.props.open}
        data={props.data}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
        <DialogContent>{props.body}</DialogContent>
        <DialogActions>
          <div className="flex flex-1 items-center justify-between sm:px-12 sm:py-6">
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={confirm}
              disabled={props.loading || props.disabled}
            >
              {!props.loading ? (
                props.ok ? (
                  props.ok
                ) : (
                  props.confirmButtonName
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
export default CustomDialog;
