import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { noteProps } from "./NoteSideBar";
import {
  setMenuOpen,
  setMode,
  setNoteId,
  setNotesNumber,
} from "@/app/redux/slice/NoteSlice";
import { FaTrashAlt } from "react-icons/fa";
import NoteForm from "./NoteForm";
import { PiNotePencilBold } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { HiDotsVertical } from "react-icons/hi";

const HomeNoteContent = () => {
  const [notes, setNotes] = useState<noteProps[]>([]);
  const [notesOptions, setNotesOptions] = useState<boolean[]>([]);
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const optionsRef = useRef<HTMLDivElement | null>(null);

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/notes?page=${page}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        setNotes((prev) => [...prev, ...data?.notes]);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };
    fetchNotes();
  }, [page]);

  // Update notes options state and handle outside click
  useEffect(() => {
    dispatch(setNotesNumber(notes.length));
    setNotesOptions(new Array(notes.length).fill(false));

    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setNotesOptions(new Array(notes.length).fill(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notes.length, dispatch]);

  // Delete a note
  const handleDeleteNotes = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      const result = await res.json();
      console.log("Deleted:", result);
      // Refresh notes
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const handleUpdateNotes = (id: string) => {
    dispatch(setNoteId(id));
    dispatch(setMode("Update"));
    dispatch(setMenuOpen(true));
  };

  const handleNotesOptions = (id: number) => {
    setNotesOptions((prev) =>
      prev.map((option, i) => (i === id ? !option : false))
    );
  };

  return (
    <>
      <h2 className="text-purple text-2xl text-center font-bold mb-4">
        Navigate Between All Of Your Notes
      </h2>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        ref={optionsRef}
      >
        {notes.map((note, i) => (
          <div
            key={note._id}
            className="bg-secondary p-5 rounded-md flex flex-col min-h-[400px] hover:scale-105 transition-all justify-between gap-10 relative"
          >
            <h6 className="text-center text-purple font-bold text-xl">
              {note.title}
            </h6>

            <div className="flex items-center flex-wrap gap-2 justify-end my-2">
              {note?.tags?.slice(1).map((tag, idx) => (
                <span
                  className="bg-purple hover:bg-purpleHover p-2 rounded-full min-w-16 text-xs font-bold flex items-center justify-center transition"
                  key={idx}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 📝 Description with line clamp */}
            <p className="line-clamp-4 text-sm text-gray-300 text-center mb-4">
              {note.description}
            </p>

            {/* ✅ Clickable button to set note ID */}
            <button
              onClick={() => dispatch(setNoteId(note._id))}
              className="bg-purple hover:bg-purpleHover text-textColor px-4 py-1 rounded-full font-semibold transition-all"
            >
              Open Note
            </button>

            <span className="absolute top-3 right-3">
              <HiDotsVertical
                onClick={() => handleNotesOptions(i)}
                className="rounded-full p-1 hover:bg-primary transition-all cursor-pointer"
                size={26}
              />
              {notesOptions[i] && (
                <div className="absolute w-28 bg-primary p-1 rounded-md z-10 top-7 right-0 shadow-lg">
                  <ul className="text-textColor font-bold flex flex-col text-sm">
                    <li
                      onClick={() => dispatch(setNoteId(note._id))}
                      className="flex gap-2 items-center p-1 hover:bg-primaryHover rounded-md transition-all cursor-pointer"
                    >
                      <CgNotes size={16} />
                      Open
                    </li>
                    <li
                      className="flex gap-2 items-center p-1 hover:bg-primaryHover rounded-md transition-all cursor-pointer"
                      onClick={() => handleUpdateNotes(note._id)}
                    >
                      <PiNotePencilBold size={16} />
                      Update
                    </li>
                    <li
                      className="flex gap-2 items-center p-1 hover:bg-primaryHover hover:text-red-600 rounded-md transition-all cursor-pointer"
                      onClick={() => handleDeleteNotes(note._id)}
                    >
                      <FaTrashAlt size={16} />
                      Delete
                    </li>
                  </ul>
                </div>
              )}
            </span>
          </div>
        ))}
      </div>
      {notes?.length % 10 === 0 && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-purple hover:bg-purpleHover text-textColor p-1 my-5 rounded-full font-semibold transition-all"
        >
          Load More
        </button>
      )}
      <NoteForm />
    </>
  );
};

export default HomeNoteContent;
