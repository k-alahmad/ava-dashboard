import { createSlice } from "@reduxjs/toolkit";
const customDialog = createSlice({
  name: "deleteDialog",
  initialState: {
    state: false,
    props: {
      open: false,
    },
    body: undefined,
    data: null,
    options: {
      children: "",
    },
  },
  reducers: {
    openCustomDialog: (state, action) => {
      state.state = true;
      state.options = action.payload;
      state.props = {
        open: true,
      };
      state.data = action.payload;
    },
    closeCustomDialog: (state, action) => {
      state.state = false;
      state.props = {
        open: false,
      };
      state.data = null;
    },
  },
});
export const { openCustomDialog, closeCustomDialog } = customDialog.actions;

export const selectCustomDialog = (state) => state.customAction;

export default customDialog.reducer;
