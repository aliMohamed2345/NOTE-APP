"use client";
import { FormEvent } from "react";
import { useState } from "react";
import { errorProps } from "./Login";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { VscNote } from "react-icons/vsc";
import { useRouter } from "next/navigation";
const Signup = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState<errorProps>();
  const [showPassword, setShowPassword] = useState(false);
  console.log({ name, email, password });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/sign-up`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data);
        } else {
          console.log(data);
          router.push(`/auth/log-in?email=${email}`);
        }
      });
  };
  return (
    <div className="container bg-secondary mx-auto px-2 flex-1 p-3 flex items-center justify-center gap-10 text-textColor font-bold flex-col">
      <h3 className="flex gap-2 font-bold items-center  mb-1  text-3xl sm:hidden">
        <VscNote className="text-purple" /> NoteKeeper
      </h3>
      <div>
        <div className="bg-primary border-2 border-primaryHover p-5 rounded-xl w-full sm:w-[40vw]">
          <h2 className="font-bold text-2xl text-purple">Create an account</h2>
          <p className="text-sm sm:text-xl">
            Join NoteKeeper to start capturing your ideas
          </p>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-5 mt-5"
          >
            <div className="flex gap-1 flex-col">
              <p>Full Name:</p>
              <input
                autoFocus={true}
                type="text"
                placeholder="John Doe"
                className="rounded-md p-1 outline-none text-primaryHover"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-1 flex-col">
              <p>Email:</p>
              <input
                type="text"
                placeholder="you@example.com"
                className="rounded-md p-1 outline-none text-primaryHover"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-1 flex-col">
              <p>password:</p>
              <div className="relative">
                <input
                  placeholder="*******"
                  className="rounded-md p-1 outline-none text-primaryHover w-full"
                  type={showPassword ? `text` : `password`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-1/2 -translate-y-1/2 right-1"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {password &&
                    (showPassword ? (
                      <FaEye className="text-purple" />
                    ) : (
                      <FaEyeSlash className="text-purple" />
                    ))}
                </span>
              </div>
            </div>
            {!error?.success && (
              <p className="text-red-600 text-center text-sm sm:text-md">
                {error?.message}
              </p>
            )}
            <p className="text-textColor text-center text-sm sm:text-lg">
              Already have an account?{" "}
              <Link href={`/auth/log-in`} className="text-purple">
                log in
              </Link>
            </p>
            <input
              disabled={!email || !password || !name}
              type="submit"
              className="bg-purple hover:bg-purpleHover transition-all p-2 rounded-md text-white font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
