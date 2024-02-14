import { configureStore } from "@reduxjs/toolkit";

// reducers
import usersReducer from "../features/usersSlice";
import socketReducer from "../features/socketSlice";
import loadingReducer from "../features/loadingSlice";

// store
export const store = configureStore({
    reducer:
    {
        usersReducer,
        socketReducer,
        loadingReducer
    }
});