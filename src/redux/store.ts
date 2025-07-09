import { configureStore } from "@reduxjs/toolkit";
import setAppSlice from "./slices/setAppSlice";
import createOperationSlice from "./slices/createOperationSlice";
import createAppSlice from "./slices/createAppSlice";
import createPermissionSlice from "./slices/createPermissionSlice";
import createRoleSlice from "./slices/createRoleSlice";
import createUserSlice from "./slices/createUserSlice";
import userReducer from "./slices/userSlice";
import { useDispatch } from "react-redux";
const store = configureStore({
  reducer: {
    setAppSlice,
    createOperationSlice,
    createAppSlice,
    createPermissionSlice,
    createRoleSlice,
    createUserSlice,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable data
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
