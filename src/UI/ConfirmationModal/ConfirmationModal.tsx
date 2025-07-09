import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@mui/material";

interface ModalProps {
    ModalText: string;
    buttonText1?: string;
    buttonText2?: string;
    handleClose?: () => void;
    handleButton1?: () => void;
    handleButton2?: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({
    ModalText,
    buttonText1,
    buttonText2,
    handleClose,
    handleButton1,
    handleButton2,
}) => {
    return (
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
            <div className="flex flex-col gap-8 relative w-[38vw]  bg-white rounded-[0.5em] p-5">
                <div>
                    {handleClose && (
                        <ClearIcon
                            onClick={handleClose}
                            style={{
                                position: "absolute",
                                top: "1.1rem",
                                right: "1.25rem",
                            }}
                        />
                    )}
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
                            className="option--2 text-[#CD6162]"
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

export default ConfirmationModal;
