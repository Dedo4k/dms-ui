import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import datasetsReducer from "./DatasetSlice";

export const store = configureStore({
  reducer: {
    authState: userReducer,
    datasetsState: datasetsReducer
  }
});

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
