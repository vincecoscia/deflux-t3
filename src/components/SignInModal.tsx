import { signIn } from "next-auth/react";
import OutsideClickHandler from "react-outside-click-handler";

const SignInModal = ({ setShowModal }) => {
  const handleSignIn = async (provider: string) => {
    await signIn(provider);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <OutsideClickHandler
        onOutsideClick={() => {
          setShowModal(false);
        }}
      >
        <div className="flex bg-slate-900 shadow-lg ">
          <div className="p-8">
            <h2 className="mb-4 text-2xl text-white">Sign In</h2>
            <button
              className="mb-4 rounded-lg bg-blue-500 py-2 px-4 text-white"
              onClick={() => handleSignIn("google")}
            >
              Sign in with Google
            </button>
            <button
              className="rounded-lg bg-blue-500 py-2 px-4 text-white"
              onClick={() => handleSignIn("magic-link")}
            >
              Sign in with Magic Link
            </button>
          </div>
          <div className=" bg-emerald-300 p-8">Some Image here</div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default SignInModal;
