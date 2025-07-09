import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Operation {
    operationName: string;
}

const initialState: Operation = {
    operationName: ''
}

const createOperationSlice = createSlice({
    name: 'createOperation',
    initialState,
    reducers: {
        setOperation: ((state, action: PayloadAction<Operation>) => {
            return {
                ...state,
                ...action.payload
            }
        })
    }

})

export const { setOperation } = createOperationSlice.actions
export default createOperationSlice.reducer