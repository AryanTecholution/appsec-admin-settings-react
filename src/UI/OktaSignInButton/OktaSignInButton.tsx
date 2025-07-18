import React from "react";
import { SiOkta } from "react-icons/si";
import { signIn } from "next-auth/react";

export function OktaSignInButton() {
    const handleClick = () => {
        signIn("okta");
    };

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
        >
            <SiOkta />
            <span className="ml-4">Continue with Okta</span>
        </button>
    );
}
