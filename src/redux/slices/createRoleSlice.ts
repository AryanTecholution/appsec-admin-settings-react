import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Role {
    name: string,
    permissionIds: string[],
    permissionNames: string[],
    permissionObjects: any[]
}

const initialState: Role = {
    name: "",
    permissionIds: [],
    permissionNames: [],
    permissionObjects: []
}

const createRoleSlice = createSlice({
    name: 'createRole',
    initialState,
    reducers: {
        setRole: ((state, action: PayloadAction<Role>) => {
            return {
                ...state,
                ...action.payload
            }
        })
    }
})

export const { setRole } = createRoleSlice.actions
export default createRoleSlice.reducer