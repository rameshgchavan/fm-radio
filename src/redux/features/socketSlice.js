import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: { socket: {} },
    reducers:
    {
        updateSocketAction: (state, action) => {
            state.socket = action.payload;
        }
    }
});

export const { updateSocketAction } = socketSlice.actions;
export default socketSlice.reducer;