import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@mui/material";
import AppLogo from "../../../public/appseclogo.svg";
import Image from "next/image";

interface ModalProps {
    ModalText: string;
    buttonText1?: string;
    buttonText2?: string;
    handleClose?: () => void;
    handleButton1?: () => void;
    handleButton2?: () => void;
}

const WarningModal: React.FC<ModalProps> = ({
    ModalText,
    buttonText1,
    buttonText2,
    handleClose,
    handleButton1,
    handleButton2,
}) => {
    return (
        <div
            className="flex justify-center items-center "
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "gray",
                zIndex: 9999,
            }}
        >
            <div
                className="flex flex-col gap-8 relative w-[32vw] min-h-[30vh]  bg-white  py-8 px-5"
                style={{
                    border: "grey solid 5px",
                    borderRadius: "2em",
                }}
            >
                <div className="flex relative">
                    <Image
                        alt="AppLogo"
                        style={{
                            width: "11.5rem",
                            height: "1.75rem",
                            cursor: "pointer",
                            transform: "scale(0.7)",
                        }}
                        src={AppLogo}
                    ></Image>

                    {handleClose && (
                        <ClearIcon
                            onClick={handleClose}
                            style={{
                                position: "absolute",
                                top: "0rem",
                                right: "1.25rem",
                            }}
                        />
                    )}
                </div>
                <div
                    className="text-gray-600 px-8"
                    style={{
                        fontWeight: "500",
                        color: "red",
                    }}
                >
                    {ModalText}
                </div>
                <div className=" flex gap-3 font-medium justify-end text-right px-2">
                    {buttonText1 && (
                        <Button
                            onClick={handleButton1}
                            className="option--1 text-[#838383]"
                            variant="text"
                        >
                            {buttonText1}
                        </Button>
                    )}
                    {buttonText2 && (
                        <Button
                            onClick={handleButton2}
                            className="option--2 text-[#fa5e52]"
                            variant="text"
                        >
                            {buttonText2}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WarningModal;
