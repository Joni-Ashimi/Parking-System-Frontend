"use client";

import { createSlice } from "@reduxjs/toolkit";

const LoaderSlice = createSlice({
    name: "loader",
    initialState: {
        show: false,
        message: "",
    },
    reducers: {
        showLoader: (state, action) => {
            state.show = true;
            state.message = action.payload;
        },
        hideLoader: (state) => {
            state.show = false;
            state.message = "";
        },
    },
});

export const { showLoader, hideLoader } = LoaderSlice.actions;

export default LoaderSlice.reducer;