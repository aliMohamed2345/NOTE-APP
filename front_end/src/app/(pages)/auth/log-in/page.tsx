import AuthCover from "@/app/components/auth/AuthCover";
import Login from "@/app/components/auth/Login";
const Page = () => {
  return (
    <div className="flex h-dvh flex-1 sm:flex-row flex-col">
      <AuthCover />
      <Login />
    </div>
  );
};

export default Page;
