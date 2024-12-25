"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: undefined,
  firstName: undefined,
  id: undefined,
  lastName: undefined,
  refreshToken: undefined,
  token: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      return { ...state, ...action.payload };
    },
    userLoggedOut: (state) => {
      return initialState;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { userLoggedIn, userLoggedOut } = authSlice.actions;
