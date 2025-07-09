// CookieConsentPopup.js
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import Cookies from "js-cookie";
import Image from "next/image";
import CookiesIcon from "@/public/cookies.svg";
import { Button } from "@mui/material";

interface Props {
  showPopup: boolean | null;
  setShowPopup: (show: boolean) => void;
  setCookieConsent: (val: string) => void;
}

const CookieConsentPopup: React.FC<Props> = ({
  showPopup,
  setShowPopup,
  setCookieConsent,
}) => {
  const handleAccept = () => {
    setCookieConsent("accepted");
    const url = new URL(process.env.REACT_APP_BASE_URL || "");
    const parts = url.hostname.split(".");
    const rootDomain = parts.slice(-2).join(".");
    Cookies.set("cookie-consent", "true", {
      expires: 365,
      domain: rootDomain,
    });
    setShowPopup(false);
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-10 shadow-lg w-[35rem] h-[25rem] max-w-full flex flex-col items-center gap-4">
            <div className="flex items-center justify-center h-[6rem] w-[6rem]">
              <Image
                src={CookiesIcon}
                alt="Cookies"
                className="h-full w-full"
              />
            </div>
            <h1 className="text-2xl font-medium text-center">
              Our website uses cookies
            </h1>
            <p className="opacity-70 text-center">
              This website requires cookies to allow user access. By clicking
              accept, you consent to our use of cookies. Do you accept?
            </p>
            <div className="flex w-full justify-between items-center pt-4">
              <Button
                sx={{ color: "#5C6AE4", fontWeight: 700 }}
                variant="text"
                onClick={handleReject}
              >
                Decline Cookies
              </Button>
              <ActionButton
                width={12}
                buttonColor={"secondary"}
                buttonText={"Accept Cookies"}
                handleClick={handleAccept}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsentPopup;
