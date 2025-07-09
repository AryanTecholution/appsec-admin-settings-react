import { TextField } from "@mui/material";
import React, { useState } from "react";
import { inherits } from "util";

interface Props {
    type: string;
    label: string;
    placeholder: string;
    name: string;
    value: string;
    handleChange: (event: any) => void;
    url?: boolean;
    error?: string | null;
    disabled: boolean;
    highlight?: "primary" | "secondary";
}

const InputFields: React.FC<Props> = ({
    type,
    label,
    placeholder,
    name,
    value,
    handleChange,
    url,
    error,
    disabled = false,
    highlight,
}) => {
    // console.log("Highligh: ", highlight);

    return (
        <>
            <div className="relative  ">
                <h4 className="text-[12px] text-[#212121] pb-1 font-bold">
                    {label}
                </h4>
                <TextField
                    autoComplete="off"
                    id="email-input"
                    placeholder={placeholder}
                    type={type}
                    variant="outlined"
                    error={Boolean(error)}
                    disabled={disabled}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "3rem",
                            width: "20.125rem",
                            color: url ? "#5E6EDC" : "rgba(0, 0, 0, 0.50)",
                            fontSize: url ? "14px" : "inherit",
                            outline: error
                                ? "#E64646 solid 0px"
                                : "#D8DADC solid 0px",
                            border: highlight && "black solid 1px",
                        },
                    }}
                    style={{
                        background: "#FBFBFB",

                        width: "20.125rem",
                        height: "3rem",

                        alignItems: "center",
                        gap: "0.625rem",
                    }}
                    name={name}
                    value={value}
                    onChange={(event) => handleChange(event)}
                />
                <p
                    className=" text-[12px] font-base absolute top-[100%] mt-1"
                    style={{ color: "#E64646" }}
                >
                    {error}
                </p>
            </div>
        </>
    );
};

export default InputFields;
