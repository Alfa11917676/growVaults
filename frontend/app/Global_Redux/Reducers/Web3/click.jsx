"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   account:null,
   asset: [null, null]
};

export const Click = createSlice({
  name: "click",
  initialState,
  reducers: {
    userAccount: (state, action) => {
        state.account = action.payload;
    },
    userAsset: (state,action) =>{
      state.asset = action.payload;
    },
    userAmount: (state,action)=>{
      state.asset = action.payload;
    }
  },
});

export const { userAccount, userAsset, userAmount} = Click.actions;

export default Click.reducer;