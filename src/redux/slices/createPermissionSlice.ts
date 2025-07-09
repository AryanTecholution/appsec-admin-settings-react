import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Permission {
    appObject: any,
    moduleIds: string[],
    moduleNames: string[],
    moduleObjects: any[]
    operationIds: string[],
    operationNames: string[],
    operationObjects: any[],
    name: string
}

const initialState: Permission = {
    appObject: {},
    moduleIds: [],
    moduleNames: [],
    moduleObjects: [],
    operationIds: [],
    operationNames: [],
    operationObjects: [],
    name: ""
}

const createPermissionSlice = createSlice({
    name: 'createPermission',
    initialState,
    reducers: {
        setPermission: ((state, action: PayloadAction<Permission>) => {
            return {
                ...state,
                ...action.payload
            }
        }) 
    }
})

export const { setPermission } = createPermissionSlice.actions
export default createPermissionSlice.reducer