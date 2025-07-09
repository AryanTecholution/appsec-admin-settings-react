import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface App {
    modules: string[];
    name: string;
    hosted_url: string;
    state_params: string;
    isDefault: boolean;
}

const initialState: App = {
    name: "",
    hosted_url: "",
    modules: [],
    state_params: "",
    isDefault: false,
};

const createAppSlice: any = createSlice({
    name: "createApp",
    initialState,
    reducers: {
        setApp: (state, action: PayloadAction<App>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setApp } = createAppSlice.actions;
export default createAppSlice.reducer;
