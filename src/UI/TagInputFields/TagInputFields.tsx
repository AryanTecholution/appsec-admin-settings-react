import React, { useEffect, useState } from "react";
import { TextField, Chip, Tooltip } from "@mui/material";

interface Props {
    label: string;
    placeholder: string;
    modules: string[];
    tags: string[];
    setTags: any;
    handleChange: (moduleName: any) => void;
    clearProp: boolean;
    error?: string | null;
    tooltip?: string | null;
    highlight?: "primary" | "secondary";
}

const TagInputFields: React.FC<Props> = ({
    label,
    placeholder,
    modules,
    handleChange,
    clearProp,
    tags = [],
    setTags,
    error,
    tooltip,
    highlight,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const addTag = (fromBlur = false) => {
        if (inputValue.trim() !== "") {
            let oldTag = tags;
            oldTag.push(inputValue.trim());
            setTags(oldTag);
            setInputValue("");
        } else if (fromBlur) {
            // If fromBlur is true, reset the inputValue
            setInputValue("");
        }
    };

    useEffect(() => {
        if (clearProp) setTags([]);
    }, [clearProp]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addTag();
            event.preventDefault(); // Prevent form submission
        }
    };

    const handleRemoveTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    return (
        <div>
            <h4 className="text-[12px] text-[#212121] pb-1 font-bold">
                {label}
            </h4>

            <div className="relative">
                <TextField
                    autoComplete="off"
                    id="input-field"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onBlur={() => addTag(true)} // Handle onBlur event
                    variant="outlined"
                    error={Boolean(error)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            height: "3rem",
                            width: "100%",
                            outline: error
                                ? "#FF0000 solid 0px"
                                : "#D8DADC solid 0px",
                            border: highlight && "black solid 1px",
                        },
                    }}
                    style={{
                        borderRadius: "0.5rem",
                        background: "#FBFBFB",
                        color: "rgba(0, 0, 0, 0.50)",
                        width: "23.125rem",
                        height: "3rem",
                        marginBottom: 5,
                    }}
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                />

                <p
                    className="text-sm font-base mt-1"
                    style={{ color: "#E64646" }}
                >
                    {error}
                </p>

                <div className="w-[23.125rem] flex gap-2 justify-start items-center flex-wrap pt-1">
                    {tags?.map((tag, index) => (
                        <Chip
                            sx={{
                                borderRadius: "0.3em",
                                background: "#EEEFFB",
                            }}
                            key={index}
                            label={tag}
                            onDelete={() => handleRemoveTag(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagInputFields;
