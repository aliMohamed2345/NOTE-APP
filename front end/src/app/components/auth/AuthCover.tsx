import React from "react";
import { VscNote } from "react-icons/vsc";

const AuthCover = () => {
  return (
    <div className="bg-gradient-to-b from-primary via-secondary to-primaryHover sm:flex items-center justify-center flex-1 text-white text-center flex-col container mx-auto px-2 hidden">
      <h3 className="flex gap-2 font-bold items-center sm:text-4xl mb-1 text-2xl">
        <VscNote className="text-purple" /> NoteKeeper
      </h3>
      <h4 className="font-bold sm:text-2xl my-4 text-lg">
        Capture your thoughts, organize your life
      </h4>
      <p className="sm:text-lg text-sm">
        NoteKeeper helps you capture ideas, organize tasks, and make things
        happen. Simple, reliable, and easy to use.
      </p>
    </div>
  );
};

export default AuthCover;
