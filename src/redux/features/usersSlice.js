import { createSlice } from "@reduxjs/toolkit";

// initialized state
const initialState =
{
    users: [],
    scrutinizedUser: {},
    userStatus: "approved"
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers:
    {
        // setting data in users array
        addUsersAction: (state, action) => {
            // overriding users and spreading payload array
            state.users = [...action.payload];
        },
        // adding new user in users array
        addUserAction: (state, action) => {
            state.users.push(action.payload);
        },
        // setting data in scrutinizedUser object 
        addScrutinizedUserAction: (state, action) => {
            // overriding scrutinizedUser
            state.scrutinizedUser = action.payload;
        },
        addUserStatus: (state, action) => {
            state.userStatus = action.payload;
        }
    }
});

// exporting actions
export const {
    addUsersAction,
    addUserAction,
    addScrutinizedUserAction,
    addUserStatus
} = usersSlice.actions;
// exporting reducer
export default usersSlice.reducer;