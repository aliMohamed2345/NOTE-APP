import AuthCover from "@/app/components/auth/AuthCover";
import Signup from "@/app/components/auth/Signup";

const Page = () => {
  return (
    <div className="flex h-dvh flex-1 sm:flex-row flex-col">
      <AuthCover />
      <Signup />
    </div>
  );
};

export default Page;
