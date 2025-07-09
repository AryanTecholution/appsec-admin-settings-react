import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const LoadingScreen: React.FC<{ open: boolean; overlayColor?: string }> = ({
    open,
    overlayColor,
}) => {
    return (
        <Backdrop
            open={open}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: overlayColor ? overlayColor : "",

                // color: background ? "#000" : "transparent",
            }}
        >
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
                <CircularProgress color="inherit" />
            </div>
        </Backdrop>
    );
};

export default LoadingScreen;
