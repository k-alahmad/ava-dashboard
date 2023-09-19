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
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectConfirmDialog } from "../store/confirmAction.slice";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ConfirmDialog = (props) => {
  const { t } = useTranslation();
  const confirmDialog = useSelector(selectConfirmDialog);
  const yesConfirmClick = props.yesConfirmClick || undefined;

  const yesConfirm = () => {
    yesConfirmClick(true, confirmDialog.data);
  };
  const handleClose = () => {
    yesConfirmClick(false);
  };

  return (
    <div>
      <Dialog
        {...confirmDialog.props}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth="xs"
        onClose={handleClose}
        open={confirmDialog.props.open}
        data={props.data}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {t("ConfirmationMessage")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {t("Sure")}
          </DialogContentText>
        </DialogContent>
        {props.field && (
          <div className="flex mx-5 my-3">
            <TextField
              fullWidth
              type="text"
              name="sizeName"
              label="Size"
              id="sizeName"
              onChange={(e) => props.setComments(e.target.value)}
              value={props.comments === "" ? "" : props.comments}
              variant="outlined"
              size="small"
            />
          </div>
        )}
        <DialogActions>
          <div className="flex flex-1 items-center justify-between sm:p-12">
            <Button onClick={handleClose} color="primary">
              {t("Cancel")}
            </Button>
            <Button
              color="primary"
              onClick={yesConfirm}
              disabled={props.loading}
            >
              {!props.loading ? (
                props.ok ? (
                  props.ok
                ) : (
                  t("Confirm")
                )
              ) : (
                <CircularProgress color="inherit" size={25} />
              )}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
