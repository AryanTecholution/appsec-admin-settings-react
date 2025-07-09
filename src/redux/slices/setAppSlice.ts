import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const setAppSlice = createSlice({
    name: 'setApp',
    initialState: {
        selectedApp: ""
    },
    reducers: {
        setSelectedAppToRedux: ((state, action: PayloadAction<string | null | any>) => {
            state.selectedApp = action.payload
        })
    }
})

export const { setSelectedAppToRedux } = setAppSlice.actions
export default setAppSlice.reducer