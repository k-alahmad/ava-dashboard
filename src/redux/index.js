import deleteActionReducer from "./deleteAction.slice";
import messageActionReducer from "./messageAction.slice";
import customActionReducer from "./customDialogAction";
import authReducer from "./auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    deleteAction: deleteActionReducer,
    messageAction: messageActionReducer,
    customAction: customActionReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
