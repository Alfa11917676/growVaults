"use client";

import { configureStore } from "@reduxjs/toolkit";
import clickReducer from './Reducers/Web3/click';


export const store = configureStore({
    reducer: {
        click: clickReducer
    },
});

export const AppDispatch = typeof store.dispatch;