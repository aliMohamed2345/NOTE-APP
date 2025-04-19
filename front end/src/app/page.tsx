"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slice/authSlice";
import { useRouter } from "next/navigation";
import NoteSideBar from "./components/notes/NoteSideBar";
import NoteContent from "./components/notes/NoteContent";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/profile`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          // If token is invalid or expired, redirect
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        if (data?.user) {
          dispatch(setUser(data.user));
        } else {
          throw new Error("No user in response");
        }
      } catch (err) {
        console.warn("User not authenticated:", err);
        router.push("/auth/log-in");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [dispatch, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-between items-start  ">
      <NoteSideBar />
      <NoteContent />
    </div>
  );
}
