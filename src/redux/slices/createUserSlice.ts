import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    email: string;
    roleObject: any[];
}

const initialState: User = {
    email: "",
    roleObject: [],
};

const createUserSlice = createSlice({
    name: "createUserSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setUser } = createUserSlice.actions;
export default createUserSlice.reducer;
