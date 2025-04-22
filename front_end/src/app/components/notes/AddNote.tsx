import { BiPlus } from "react-icons/bi";
import { PiNotepadBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setMode, setMenuOpen } from "@/app/redux/slice/NoteSlice";
const AddNote = () => {
  const dispatch = useDispatch();
  const handleCreateNotes = () => {
    dispatch(setMode(`Create`));
    dispatch(setMenuOpen(true));
  };
  return (
    <div className="flex items-center flex-col bg-secondary text-textColor gap-4 sm:gap-5 p-5 rounded-lg font-bold w-[300px] sm:w-[500px] text-center">
      <span className="p-5 bg-purple rounded-full">
        <PiNotepadBold size={60} />
      </span>
      <h2 className="sm:text-3xl text-lg text-purple">Welcome To NoteKeeper</h2>
      <p className="text-sm sm:text-lg">Your Personal note-taking workspace</p>
      <p className="sm:text-lg text-xs">
        Create Your first note to get started with organizing your thoughts ,
        ideas, and important information
      </p>
      <button
        className="bg-purple hover:bg-purpleHover transition-all flex text-textColor font-bold items-center justify-center gap-3 rounded-md p-2"
        onClick={handleCreateNotes}
      >
        <BiPlus size={25} />
        Create your first note
      </button>
    </div>
  );
};

export default AddNote;
