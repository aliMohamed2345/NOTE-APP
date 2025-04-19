import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AuthSlice from "./slice/authSlice";
import NoteSlice from "./slice/NoteSlice";
const RootReducers = combineReducers({
  Auth: AuthSlice,
  Note: NoteSlice,
});

export const store = configureStore({
  reducer: RootReducers,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
