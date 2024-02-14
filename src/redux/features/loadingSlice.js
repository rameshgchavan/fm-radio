import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
    name: "loading",
    initialState: { isLoading: false },
    reducers:
    {
        changeLoadingAction: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { changeLoadingAction } = loadingSlice.actions;
export default loadingSlice.reducer;