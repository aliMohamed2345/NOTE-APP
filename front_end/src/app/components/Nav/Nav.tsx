"use client";
import { VscNote } from "react-icons/vsc";
import SideMenu from "./SideMenu";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
const Nav = () => {
  const { user } = useSelector((state: RootState) => state.Auth);
  if (!user ) return;
  return (
    <header className=" shadow-md bg-secondary sm:hidden fixed w-full z-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={`/`}
            className="flex gap-2 font-bold items-center justify-center text-textColor text-3xl "
          >
            <VscNote className="text-purple" /> NoteKeeper
          </Link>
          <SideMenu />
        </div>
      </div>
    </header>
  );
};

export default Nav;
