import { createSlice } from "@reduxjs/toolkit";

interface authProps {
  user: {
    id: string;
    name: string;
  } | null;
}

const initialState: authProps = { user: null };

const authSlice = createSlice({
  name: `Auth`,
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
