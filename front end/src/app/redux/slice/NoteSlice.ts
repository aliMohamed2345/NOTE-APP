import { createSlice } from "@reduxjs/toolkit";

interface NoteProps {
  mode: `Create` | `Update`;
  NoteId: string;
  isMenuOpen: boolean;
  notesNumber: number;
}

const initialState: NoteProps = {
  mode: `Create`,
  NoteId: ``,
  isMenuOpen: false,
  notesNumber: 0,
};

const NoteSlice = createSlice({
  name: `Note`,
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setNoteId: (state, action) => {
      state.NoteId = action.payload;
    },
    setMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setNotesNumber: (state, action) => {
      state.notesNumber = action.payload;
    },
  },
});
export const { setMenuOpen, setMode, setNoteId, setNotesNumber } =
  NoteSlice.actions;
export default NoteSlice.reducer;
