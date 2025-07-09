// CookieConsentPopup.js
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import Cookies from "js-cookie";
import Image from "next/image";
import CookiesIcon from "@/public/cookies.svg";
import { MdCrisisAlert } from "react-icons/md";
import { Button } from "@mui/material";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

interface Props {
    signinDisclaimer: string | null;
    showPopup: boolean | null;
    setLoading: (loading: boolean) => void;
    setSigninDisclaimerPopup: (show: boolean) => void;
    setSigninDisclaimer: (val: string) => void;
    setShowSigninDisclaimerPopup: (show: boolean) => void;
}

const SigninDisclaimer: React.FC<Props> = ({
    setLoading,
    showPopup,
    signinDisclaimer,
    setSigninDisclaimerPopup,
    setSigninDisclaimer,
    setShowSigninDisclaimerPopup,
}) => {
    const handleAccept = async () => {
        setSigninDisclaimerPopup(false);
        setSigninDisclaimer("accepted");
        setShowSigninDisclaimerPopup(false);
        setLoading(true);
        try {
            await signIn("github");
        } catch (error: any) {
            console.error(error.message);
        }
        setLoading(false);
    };

    const handleReject = () => {
        setShowSigninDisclaimerPopup(false);

        setSigninDisclaimer("rejected");
        setSigninDisclaimerPopup(false);
    };

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-10 shadow-lg w-[35rem] h-[25rem] max-w-full flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center h-[6rem] w-[6rem]">
                            <MdCrisisAlert className="h-full w-full" />
                        </div>
                        <h1 className="text-2xl font-medium text-center">
                            Disclaimer
                        </h1>
                        <p className="opacity-70 text-center">
                            This website requires user to sign in with Github
                            single sign on in order to provide various
                            functionalities . You can sign in using Github using
                            the button below .
                        </p>
                        <div className="flex w-full justify-between items-center pt-4">
                            <Button
                                sx={{ color: "#5C6AE4", fontWeight: 700 }}
                                variant="text"
                                onClick={handleReject}
                            >
                                Decline
                            </Button>

                            <Button
                                style={{
                                    backgroundColor: "black",
                                    color: "white",
                                }}
                                sx={{
                                    display: "flex",
                                    gap: "0.5em",

                                    fontWeight: 700,
                                    "&:hover": {
                                        backgroundColor: "grey",
                                    },
                                    "&:active": {
                                        backgroundColor: "grey",
                                    },
                                    "&:focus": {
                                        backgroundColor: "grey",
                                    },
                                }}
                                variant="contained"
                                onClick={handleAccept}
                            >
                                <FaGithub /> Sign In with Github
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SigninDisclaimer;
