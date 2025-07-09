// CookieConsentPopup.js
import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton/ActionButton";
import SettingsButton from "../ActionButton/ActionButton";

const CookieReconsentPopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleAccept = () => {
        localStorage.removeItem("cookieConsent");
        setShowPopup(false);
    };

    const handleReject = () => {
        setShowPopup(false);
    };

    return (
        <>
            {showPopup && (
                <div
                    className="flex justify-center items-center"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 9999,
                    }}
                >
                    <div className="cookie-popup absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-4 w-[25rem] bg-white rounded-[0.5em] p-4 opacity-100 z-10">
                        <h1 className="text-2xl text-center">Cookie Consent</h1>
                        <p>
                            This website requires cookies to enhance user
                            experience. Do you accept?
                        </p>
                        <div className="flex w-full justify-between items-center">
                            <ActionButton
                                buttonColor={"secondary"}
                                buttonText={"Accept"}
                                handleClick={handleAccept}
                            />
                            <ActionButton
                                buttonColor={"error"}
                                buttonText={"Reject"}
                                handleClick={handleReject}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieReconsentPopup;
