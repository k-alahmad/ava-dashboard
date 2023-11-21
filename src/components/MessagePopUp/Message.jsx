import React, { memo, useEffect } from "react";
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  hideMessage,
  selectOptions,
  selectState,
} from "../../redux/messageAction.slice";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

const variantIcon = {
  success: "check_circle",
  warning: "warning",
  error: "error_outline",
  info: "info",
};

function Message(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectState);
  const options = useSelector(selectOptions);
  useEffect(() => {
    if (state) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 4000);
    }
  }, [state]);
  return (
    <Snackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      // autoHideDuration={3000}
      ContentProps={{
        variant: "body2",
        headlineMapping: {
          body1: "div",
          body2: "div",
        },
      }}
      style={{
        background:
          variantIcon[options.variant] &&
          (options.variant === "success"
            ? "green"
            : options.variant === "error"
            ? "red"
            : null),
      }}
      disableWindowBlurListener={true}
    >
      <SnackbarContent
        style={{
          background:
            variantIcon[options.variant] &&
            (options.variant === "success"
              ? "green"
              : options.variant === "error"
              ? "red"
              : null),
        }}
        message={
          <div className="flex items-center">
            {variantIcon[options.variant] &&
              (options.variant === "success" ? (
                <CheckCircleOutlineRoundedIcon />
              ) : options.variant === "error" ? (
                <ErrorOutlineRoundedIcon />
              ) : null)}
            <Typography className="mx-8">{options.message}</Typography>
          </div>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(hideMessage())}
          >
            <CloseIcon fontSize="large" />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

export default memo(Message);
