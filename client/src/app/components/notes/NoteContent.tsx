import { useDispatch, useSelector } from "react-redux";
import AddNote from "./AddNote";
import { RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { noteProps } from "./NoteSideBar";
import HomeNoteContent from "./HomeNoteContent";
import { SlArrowRight } from "react-icons/sl";
import { setNoteId } from "@/app/redux/slice/NoteSlice";

const NoteContent = () => {
  const { notesNumber, NoteId } = useSelector((state: RootState) => state.Note);
  const [note, setNote] = useState<noteProps>();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!NoteId) return;
    const getNoteData = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${NoteId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setNote(data?.note);
        });
    };
    getNoteData();
  }, [NoteId]);

  return (
    <div className="min-h-[300vh]  overflow-y-auto sm:w-[75vw] bg-primary text-textColor container p-5 flex-1  flex flex-col gap-5">
      {notesNumber === 0 && (
        <div className=" flex items-center justify-center">
          <AddNote />
        </div>
      )}
      {!NoteId ? (
        <HomeNoteContent />
      ) : (
        <>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-md text-textColor w-fit mt-14 mb-5">
            <button
              className="hover:text-purple transition-all"
              onClick={() => dispatch(setNoteId(""))}
            >
              Home
            </button>
            <SlArrowRight className="font-bold" />
            <button
              className="hover:text-purple transition-all"
              onClick={() => dispatch(setNoteId(note?._id))}
            >
              {note?.title}
            </button>
          </div>
          <h2
            className={`text-4xl text-purple font-bold ${
              note?.tags.length === 0 && `text-center`
            }`}
          >
            {note?.title}
          </h2>
          <div className="flex items-center justify-end gap-5  mt-10 flex-wrap">
            {note?.tags?.map((tag, i) => (
              <span
                className="bg-purple hover:bg-purpleHover rounded-full p-2 min-w-16 flex items-center justify-center transition font-bold"
                key={i}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="leading-relaxed overflow-x-auto  text-center font-bold mt-5">
            {note?.description}
          </p>
        </>
      )}
    </div>
  );
};

export default NoteContent;
