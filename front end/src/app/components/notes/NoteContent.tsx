import { useSelector } from "react-redux";
import AddNote from "./AddNote";
import { RootState } from "@/app/redux/store";
import { useEffect, useState } from "react";
import { noteProps } from "./NoteSideBar";
const NoteContent = () => {
  const { notesNumber, NoteId } = useSelector((state: RootState) => state.Note);
  const [note, setNote] = useState<noteProps>();
  console.log(NoteId);
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
  console.log(note);
  return (
    <div className="min-h-screen w-full sm:w-[75vw] bg-primary text-textColor container px-2  pt-5">
      {notesNumber === 0 && (
        <div className=" flex items-center justify-center">
          <AddNote />
        </div>
      )}
      <h2 className="text-4xl text-purple font-bold">{note?.title}</h2>
      <div className="flex items-center justify-end gap-5  mt-10 flex-wrap">
        {note?.tags?.map((tag, i) => (
          <span
            className="bg-purple hover:bg-purpleHover rounded-full p-2 min-w-16 flex items-center justify-center transition font-bold"
            key={i}
          >
            {tag}
          </span>
        ))}
        <p className="leading-relaxed overflow-x-auto  max-w-full w-[90vw] text-center">
          {note?.description}
        </p>
      </div>
    </div>
  );
};

export default NoteContent;
