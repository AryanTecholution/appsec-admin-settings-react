import React from "react";

interface StatusTagProps {
    tagBackground: string;
    textColor: string;
    tagText: string;
}
const StatusTag: React.FC<StatusTagProps> = ({
    tagBackground,
    textColor,
    tagText,
}) => {
    return (
        <span
            style={{
                background: tagBackground,
                color: textColor,
                whiteSpace: "nowrap",
                padding: "0.3em 1em ",
                borderRadius: "1rem",
            }}
            className="flex justify-left items-center gap-2 font-medium rounded p-1"
        >
            <span
                style={{
                    background: textColor,
                }}
                className="w-[0.5em] h-[0.5em] flex justify-center items-center rounded-full"
            ></span>
            {tagText}
        </span>
    );
};

export default StatusTag;
