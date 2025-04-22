import { useEffect, useRef, useState } from "react";
import { BiPlus, BiSearch } from "react-icons/bi";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { PiNotePencilBold } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { FaTrashAlt } from "react-icons/fa";
import NoteForm from "./NoteForm";
import {
  setMenuOpen,
  setMode,
  setNoteId,
  setNotesNumber,
} from "@/app/redux/slice/NoteSlice";
import getRelativeTime from "@/app/utils/getRelativeTime";
export interface noteProps {
  User: string;
  description: string;
  title: string;
  tags: string[];
  _id: string;
  createdAt: string;
}

const ResponsiveNoteSideMenu = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const optionsRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<noteProps[]>([]);
  const [notesOptions, setNotesOptions] = useState<boolean[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState(``);
  const { user } = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    // Redirect if not logged in
    if (!user ) {
      router.push("/auth/log-in");
    }
  }, [router, user]);

  useEffect(() => {
    //setting all the options to be false
    setNotesOptions(new Array(notes?.length).fill(false) || []);
  }, [notes]);

  useEffect(() => {
    dispatch(setNotesNumber(notes?.length));
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setNotesOptions(new Array(notes?.length).fill(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notes?.length, dispatch]);

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
        dispatch(setNotesNumber(data?.totalNotes));
        if (page === 1) {
          setNotes(data?.notes);
        } else {
          setNotes((prev) => [...prev, ...data?.notes]);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    if (!searchValue.trim()) {
      fetchNotes();
    }
  }, [page, searchValue, dispatch]);

  const handleNotesOptions = (id: number) => {
    //this code will toggle the options for on clicking in a specific note
    setNotesOptions((prev) =>
      prev.map((option, i) => (i === id ? !option : false))
    );
  };

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes`, {
        method: `GET`,
        credentials: "include",
      });
      const data = await res.json();
      setNotes(data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // Delete a note and refetch
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
      fetchNotes(); // Refresh list
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };
  const handleUpdateNotes = (id: string) => {
    dispatch(setNoteId(id));
    dispatch(setMode("Update"));
    dispatch(setMenuOpen(true));
  };
  const handleCreateNotes = () => {
    dispatch(setMode(`Create`));
    dispatch(setMenuOpen(true));
  };
  const handleSearchNotes = async () => {
    //see if the search value is empty he will refetch the notes again
    if (!searchValue.trim()) {
      setPage(1);
      return;
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/search?q=${searchValue}`,
      {
        credentials: `include`,
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotes(data.notes);
        }
      });
  };
  return (
    <div
      ref={optionsRef}
      className="flex flex-col gap-5 text-center sticky px-3 overflow-y-auto h-screen"
    >
      {/* Search */}
      <div className="relative">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === `Enter` && handleSearchNotes()}
          type="text"
          className="bg-secondary hover:bg-primaryHover transition p-1.5 mt-2 pl-8 rounded-lg text-textColor outline-none w-full"
          placeholder="search Notes..."
        />
        <BiSearch
          onClick={() => handleSearchNotes()}
          className="absolute top-1/2 -translate-y-1/4 text-purple font-bold left-1 text-2xl cursor-pointer"
        />
      </div>
      {/* Add Note Button */}{" "}
      <button
        className="bg-purple hover:bg-purpleHover transition-all flex text-textColor font-bold items-center justify-center gap-3 rounded-md p-2"
        onClick={handleCreateNotes}
      >
        <BiPlus size={25} />
        Add New Note
      </button>
      <NoteForm />
      {/* Notes List */}
      <div>
        <div className="w-full bg-textColor h-1" />
        <div className="flex justify-between items-center">
          <h2 className="font-bold my-2 text-2xl text-purple">Notes</h2>
          <span className="bg-purple p-1 w-8 h-8 text-textColor flex items-center justify-center rounded-full font-bold">
            {notes?.length || 0}
          </span>
        </div>

        <div className="flex flex-col gap-3 text-textColor">
          {notes?.map((note, i) => (
            <button
              key={i}
              onClick={() => dispatch(setNoteId(note._id))}
              className="hover:bg-primaryHover p-1 rounded-md h-16"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="text-left font-bold">{note.title}</h1>
                  <p className="text-left text-xs">
                    {getRelativeTime(note.createdAt)}
                  </p>
                </div>
                <span className="relative">
                  <HiDotsVertical
                    onClick={() => handleNotesOptions(i)}
                    className="rounded-full p-1 hover:bg-primary transition-all"
                    size={26}
                  />
                  {notesOptions[i] && (
                    <div
                      className={`absolute w-24 h-26 left-[-70px] bg-primary p-1 rounded-md z-10`}
                    >
                      <ul className="text-textColor font-bold flex flex-col">
                        <li
                          onClick={() => dispatch(setNoteId(note._id))}
                          className="flex gap-2 items-center p-1 hover:bg-primaryHover rounded-md transition-all"
                        >
                          <CgNotes size={16} />
                          Open
                        </li>
                        <li
                          className="flex gap-2 items-center p-1 hover:bg-primaryHover rounded-md transition-all"
                          onClick={() => handleUpdateNotes(note._id)}
                        >
                          <PiNotePencilBold size={16} />
                          Update
                        </li>
                        <NoteForm />
                        <li
                          className="flex gap-2 items-center p-1 hover:bg-primaryHover hover:text-red-600 rounded-md transition-all"
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
            </button>
          ))}
          {/* Load more */}
        </div>
        {notes?.length % 10 === 0 && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-purple hover:bg-purpleHover my-4 rounded-full p-1 transition-all hover:text-textColor font-bold"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default ResponsiveNoteSideMenu;
