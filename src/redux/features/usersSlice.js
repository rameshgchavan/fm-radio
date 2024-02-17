import { createSlice } from "@reduxjs/toolkit";

// initialized state
const initialState =
{
    scrutinizedUser: {}
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers:
    {
        // setting data in scrutinizedUser object 
        addScrutinizedUserAction: (state, action) => {
            // overriding scrutinizedUser
            state.scrutinizedUser = action.payload;
        }
    }
});

// exporting actions
export const {
    addScrutinizedUserAction,
} = usersSlice.actions;

// exporting reducer
export default usersSlice.reducer;