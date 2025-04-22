"use client";
import { useState } from "react";
import { PiListBold } from "react-icons/pi";
import { IoArrowBackSharp } from "react-icons/io5";
import { VscNote } from "react-icons/vsc";
import ResponsiveNoteSideMenu from "../notes/ResponsiveNoteSideMenu";
const SideMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //   const pathname = usePathname(); // Get current path

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="p-1 rounded-full transition-all ease-in-out hover:bg-purpleHover font-bold opacity-80 hover:opacity-100 text-textColor"
      >
        <PiListBold size={25} />
      </button>

      <div
        className={`h-full fixed ${
          isOpen ? `right-0` : `right-[-500px]`
        } min-w-[275px] lg:min-w-[400px] z-10 top-0 transition-all bg-primary flex-col shadow-lg flex justify-start`}
      >
        <div className="flex content-start gap-3 items-center my-5 mx-4">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="hover:bg-purpleHover hover:opacity-100 rounded-full transition-all p-1 text-textColor"
          >
            <IoArrowBackSharp size={25} />
          </button>

          <div className="text-center">
            <h3 className="flex gap-2 font-bold items-center justify-center text-textColor text-3xl ">
              <VscNote className="text-purple" /> NoteKeeper
            </h3>
          </div>
        </div>
        <div>
          <ResponsiveNoteSideMenu />
        </div>
      </div>
      {
        // Overlay for the side menu
        isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 z-5"
          ></div>
        )
      }
    </>
  );
};

export default SideMenu;
