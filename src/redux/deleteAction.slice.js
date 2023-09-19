import { createSlice } from "@reduxjs/toolkit";

const deleteDialog = createSlice({
  name: "deleteDialog",
  initialState: {
    state: false,
    props: {
      open: false,
    },
    data: null,
    options: {
      children: "Hi",
    },
  },
  reducers: {
    openDeleteDialog: (state, action) => {
      state.state = true;
      state.options = action.payload;
      state.props = {
        open: true,
      };
      state.data = action.payload;
    },
    closeDeleteDialog: (state, action) => {
      state.state = false;
      state.props = {
        open: false,
      };
      state.data = null;
    },
  },
});
export const { openDeleteDialog, closeDeleteDialog } = deleteDialog.actions;

export const selectDeleteDialog = (state) => state.deleteAction;

export default deleteDialog.reducer;
