import React from "react";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { SxProps } from "@mui/system";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    placeholder: string;
    onSelect: (value: Option | null) => void;
    sx?: SxProps;
    textFieldProps?: Partial<TextFieldProps>;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    placeholder,
    onSelect,
    sx,
    textFieldProps,
}) => {
    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            onChange={(_, newValue) => onSelect(newValue)}
            renderInput={(params) => (
                <TextField
                    autoComplete="off"
                    {...params}
                    {...textFieldProps}
                    placeholder={placeholder}
                    variant="outlined"
                    sx={{
                        ...sx,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "0.65rem", // Adjusted for rounded-md styling
                            "& .MuiOutlinedInput-input": {
                                padding: "0.85rem 0.2rem", // Decrease padding to reduce height
                            },
                            "& .MuiInputAdornment-positionStart": {
                                marginTop: "0px", // Adjust start adornment if used
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            transform: "translate(14px, 12px) scale(1)", // Adjust label position
                            "&.MuiInputLabel-shrink": {
                                transform: "translate(14px, -6px) scale(0.75)", // Adjust label position when shrunk
                            },
                        },
                        "& .MuiAutocomplete-inputRoot": {
                            paddingTop: "0px !important", // Override padding for input root
                            paddingBottom: "0px !important", // Override padding for input root
                        },
                        "& .MuiAutocomplete-listbox": {
                            maxHeight: "145px", // Adjust listbox max height if needed
                            "& .MuiAutocomplete-option": {
                                minHeight: "36px", // Reduce option height
                            },
                        },
                    }}
                />
            )}
        />
    );
};

export default SearchableSelect;
