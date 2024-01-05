import { signIn } from "next-auth/react";
import OutsideClickHandler from "react-outside-click-handler";

const SignInModal = ({ setShowModal }) => {
  const handleSignIn = async (provider: string, email?: string) => {
    await signIn(provider);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-1/2 bg-slate-900 shadow-lg">
        <OutsideClickHandler
          onOutsideClick={() => {
            setShowModal(false);
          }}
        >
          <div className="flex">
            <div className="flex flex-col p-8">
              <h2 className="mb-4 text-2xl text-white">Sign In</h2>
              <div className="mb-4">
                <input
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Email"
                />
              </div>
              <button
                className="rounded-lg bg-blue-500 py-2 px-4 text-white"
                onClick={() => handleSignIn("email")}
              >
                Sign in with Email
              </button>
              <div className="flex">
                <div className="mt-5 w-full border-t border-white opacity-50" />
                <h2 className="my-2 mx-2 text-white">Or</h2>
                <div className="mt-5 w-full border-t border-white opacity-50" />
              </div>
              <div className="flex">
                <button
                  className=" w-10 rounded-full bg-white p-2 text-white"
                  onClick={() => handleSignIn("google")}
                >
                  <img
                    src="https://deflux.s3.amazonaws.com/assets/google_logo.png"
                    alt="Google Logo"
                    className="mr-2 inline-block h-6 w-6"
                  />
                </button>
              </div>
            </div>
            <div className=" hidden bg-emerald-300 p-8 lg:block">
              Some Image here
            </div>
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default SignInModal;
