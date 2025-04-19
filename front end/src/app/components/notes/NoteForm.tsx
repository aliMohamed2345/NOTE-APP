import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { errorProps } from "../auth/Login";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setMenuOpen } from "@/app/redux/slice/NoteSlice";
import { noteProps } from "./NoteSideBar";

const NoteForm = () => {
  const dispatch = useDispatch();
  const { isMenuOpen, NoteId, mode } = useSelector(
    (state: RootState) => state.Note
  );
  const [oldNote, setOldNote] = useState<noteProps>();
  const [title, setTitle] = useState(``);
  const [description, setDescription] = useState(``);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<errorProps>();

  //resting the states when the windows is closed
  useEffect(() => {
    if (!isMenuOpen) {
      setTitle("");
      setDescription("");
      setTag("");
      setTags([]);
      setError({ success: true, message: "" });
    }
  }, [isMenuOpen]);

  //fetching the old note data
  useEffect(() => {
    if (mode === `Update` && NoteId && isMenuOpen) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${NoteId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setError(data);
          } else {
            setOldNote(data.note);
          }
        });
    }
  }, [mode, dispatch, NoteId, isMenuOpen]);

  useEffect(() => {
    // Update form fields after fetching oldNote
    if (mode === "Update" && oldNote) {
      setTitle(oldNote.title || "");
      setDescription(oldNote.description || "");
      setTags(oldNote.tags || []);
    }
  }, [oldNote, mode]);
  const handleAddTagToTags = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); //to prevent when clicking on enter to activate the form function
      if (tag) {
        setTags((prev) => [...prev, tag]);
        setTag("");
      }
    }
  };
  const handleDeleteTag = (id: number) => {
    setTags((prev) => prev.filter((_, i) => i !== id));
  };
  const handleCreateNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const CurrentNote = { title, description, tags };
    if (mode === `Create`) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CurrentNote),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setError(data);
          } else {
            dispatch(setMenuOpen(false));
          }
        });
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/${NoteId}`, {
        method: `PATCH`,
        credentials: `include`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(CurrentNote),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (!data.success) {
            setError(data);
          } else {
            dispatch(setMenuOpen(false));
          }
        });
    }
  };

  return (
    <>
      {isMenuOpen && (
        <div
          onClick={() => dispatch(setMenuOpen(false))}
          className="fixed inset-0 bg-black/80 z-10 cursor-auto"
        ></div>
      )}
      <div
        className={`w-[80vw] cursor-auto min-h-[600px] flex flex-col justify-center gap-5 p-3 z-10 bg-primary duration-300 transform -translate-x-1/2 -translate-y-1/2 fixed left-1/2 text-text_color transition-all container ${
          isMenuOpen
            ? `opacity-100 scale-100 top-1/2`
            : `opacity-0 scale-0 top-[-300px]`
        } rounded-lg container mx-auto`}
      >
        <h2 className="text-purple text-4xl font-bold mb-5 mt-2">
          {mode === `Create` ? `Create Note` : `Update Note`}
        </h2>
        <form
          className="flex-col flex gap-10"
          onSubmit={(e) => handleCreateNote(e)}
        >
          <div className="flex flex-col gap-3 justify-center text-textColor font-bold items-center">
            <p>Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus={true}
              type="text"
              placeholder="input the note title"
              className="rounded-xl p-1 outline-none w-full bg-secondary border-purple border-2"
            />
          </div>
          <div className="flex gap-3 flex-col text-textColor font-bold items-center">
            <p>Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="input the note content"
              className="rounded-xl p-1 outline-none w-full bg-secondary border-purple border-2"
            />
          </div>
          <div className="flex justify-between gap-5">
            <div className="flex items-center gap-2 text-textColor font-bold ">
              <p>Tags</p>
              <input
                onKeyDown={(e) => handleAddTagToTags(e)}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                type="text"
                placeholder="add tags here"
                className="rounded-xl p-1 outline-none w-[20vw] bg-secondary border-purple border-2 h-14"
              />
            </div>
            <div className="bg-primary border-purple border-2 p-2 w-full h-14 overflow-y-auto rounded-xl flex justify-center flex-wrap gap-1  text-textColor ">
              {isMenuOpen &&
                tags?.map((tag, i) => (
                  <span
                    key={i}
                    className=" bg-purple rounded-full p-1 min-w-20 font-bold flex items-center  justify-between gap-2"
                  >
                    {tag}
                    <IoClose
                      onClick={() => handleDeleteTag(i)}
                      className="text-primary rounded-full hover:bg-purpleHover transition-all cursor-pointer"
                    />
                  </span>
                ))}
            </div>
          </div>
          {!error?.success && (
            <>
              <p className="text-red-600 text-center text-md sm:text-md font-bold ">
                {error?.message}
              </p>
            </>
          )}
          <input
            disabled={!title || !description}
            type="submit"
            value={mode === `Create` ? `Create Note` : `Update Note`}
            className="bg-purple font-bold hover:bg-purpleHover p-2 rounded-lg cursor-pointer text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </form>
      </div>
    </>
  );
};

export default NoteForm;
